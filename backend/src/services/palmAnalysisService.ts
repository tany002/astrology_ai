import { v4 as uuidv4 } from 'uuid';
import { getOpenAI } from '../config/openai.js';
import { Report } from '../models/Report.js';
import type { PalmAnalysis, FullReport, ReportPreview, ReportSections } from '../types/index.js';
import {
  VISION_SYSTEM_PROMPT,
  VISION_USER_PROMPT,
  VISION_PROMPT_VERSION,
} from '../prompts/visionPrompt.js';
import {
  REPORT_SYSTEM_PROMPT,
  buildReportUserPrompt,
  REPORT_PROMPT_VERSION,
} from '../prompts/reportPrompt.js';
import { logger } from '../utils/logger.js';

const VISION_MODEL = 'gpt-4o';
const LLM_MODEL = 'gpt-4o';

export class PalmAnalysisError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 422
  ) {
    super(message);
    this.name = 'PalmAnalysisError';
  }
}

async function runVisionAnalysis(imageUrl: string): Promise<PalmAnalysis> {
  logger.info('PalmAnalysis', `Running vision analysis on: ${imageUrl}`);
  const openai = getOpenAI();

  const response = await openai.chat.completions.create({
    model: VISION_MODEL,
    max_tokens: 1000,
    messages: [
      {
        role: 'system',
        content: VISION_SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: imageUrl, detail: 'high' },
          },
          {
            type: 'text',
            text: VISION_USER_PROMPT,
          },
        ],
      },
    ],
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new PalmAnalysisError('Vision analysis returned no content.', 500);
  }

  let analysis: PalmAnalysis;
  try {
    analysis = JSON.parse(content) as PalmAnalysis;
  } catch {
    throw new PalmAnalysisError('Vision analysis returned invalid JSON.', 500);
  }

  if (analysis.imageQuality === 'poor') {
    throw new PalmAnalysisError(
      'The image quality is too low for accurate palm reading. Please upload a clearer photo with good lighting.',
      422
    );
  }

  if (typeof analysis.confidence === 'number' && analysis.confidence < 0.35) {
    throw new PalmAnalysisError(
      'We could not clearly detect a palm in this image. Please ensure your palm is clearly visible and well-lit.',
      422
    );
  }

  logger.info('PalmAnalysis', `Vision analysis complete. Confidence: ${analysis.confidence}`);
  return analysis;
}

async function generateReport(analysis: PalmAnalysis): Promise<ReportSections> {
  logger.info('PalmAnalysis', 'Generating palm reading report');
  const openai = getOpenAI();

  const analysisJson = JSON.stringify(analysis, null, 2);
  const userPrompt = buildReportUserPrompt(analysisJson);

  const response = await openai.chat.completions.create({
    model: LLM_MODEL,
    max_tokens: 3000,
    messages: [
      { role: 'system', content: REPORT_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new PalmAnalysisError('Report generation returned no content.', 500);
  }

  let sections: ReportSections;
  try {
    sections = JSON.parse(content) as ReportSections;
  } catch {
    throw new PalmAnalysisError('Report generation returned invalid JSON.', 500);
  }

  if (
    !sections.personality ||
    !sections.love ||
    !sections.career ||
    !sections.health ||
    !Array.isArray(sections.strengths) ||
    !Array.isArray(sections.growthAreas) ||
    !sections.luckyElements ||
    !sections.summary
  ) {
    throw new PalmAnalysisError('Generated report is missing required sections.', 500);
  }

  logger.info('PalmAnalysis', 'Report generation complete');
  return sections;
}

function extractPreview(sections: ReportSections): ReportPreview {
  function truncateToWords(text: string, maxWords: number): string {
    const words = text.split(/\s+/);
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  }

  const firstPersonalityParagraph = sections.personality.split('\n\n')[0] ?? sections.personality;
  const firstLoveParagraph = sections.love.split('\n\n')[0] ?? sections.love;

  return {
    personality: truncateToWords(firstPersonalityParagraph, 45),
    love: truncateToWords(firstLoveParagraph, 40),
  };
}

export async function analyzeAndGenerateReport(imageUrl: string): Promise<{
  reportId: string;
  preview: ReportPreview;
}> {
  const reportId = uuidv4();
  const now = new Date().toISOString();

  const analysis = await runVisionAnalysis(imageUrl);
  const sections = await generateReport(analysis);
  const preview = extractPreview(sections);

  const fullReport: FullReport = {
    metadata: {
      reportId,
      createdAt: now,
      language: 'en',
      confidence: analysis.confidence ?? 0.8,
      visionModel: VISION_MODEL,
      llmModel: LLM_MODEL,
      visionPromptVersion: VISION_PROMPT_VERSION,
      reportPromptVersion: REPORT_PROMPT_VERSION,
    },
    sections,
  };

  await Report.create({
    reportId,
    imageUrl,
    preview,
    fullReport,
    analysis,
    paymentStatus: 'pending',
  });

  logger.info('PalmAnalysis', `Report saved to database. reportId: ${reportId}`);

  return { reportId, preview };
}
