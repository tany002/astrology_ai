import type { ReportDocument } from "@/types/report";

// Fixed timestamp — avoids server/client hydration mismatch
const MOCK_CREATED_AT = "2026-07-27T13:00:00.000Z";

export const MOCK_REPORT_ID = "mock-report-2024";

export const MOCK_REPORT: ReportDocument = {
  reportId: MOCK_REPORT_ID,
  imageUrl: "",
  paymentStatus: "paid",
  createdAt: MOCK_CREATED_AT,

  preview: {
    personality:
      "You approach life with a thoughtful, reflective nature that draws people toward you. Your palm reflects a person who values depth over surface — someone who thinks carefully before acting and feels deeply before speaking.",
    love: "You tend to value long-term emotional stability over fleeting excitement. Deep connections matter to you, and you offer loyalty and warmth to those who earn your trust.",
  },

  fullReport: {
    metadata: {
      reportId: MOCK_REPORT_ID,
      createdAt: MOCK_CREATED_AT,
      language: "en",
      confidence: 0.92,
      visionModel: "gpt-4.1-vision",
      llmModel: "gpt-4.1",
      visionPromptVersion: "1.0.0",
      reportPromptVersion: "1.0.0",
    },

    sections: {
      personality: `Your palm reflects a rich inner world guided by curiosity, emotional intelligence, and a steady sense of purpose. The clarity and depth of your major lines suggest someone who approaches life with both feeling and intention — rarely acting on impulse, but with considered care.

You are the kind of person who observes before engaging, reflects before responding, and values quality in both work and relationships. This thoughtfulness is a genuine strength, giving you a natural ability to see situations from multiple angles.

Your palm also shows a strong adaptability — you may have navigated meaningful changes in your life and emerged with greater clarity each time. There is a resilience here that goes beyond stubbornness; it is the quiet determination of someone who trusts the process even when the path is unclear.`,

      love: `Your heart line suggests a person who loves with intention and depth. You are not drawn to casual connections — you seek genuine understanding, emotional honesty, and the kind of trust that grows slowly over time.

In relationships, you tend to be the thoughtful partner: the one who remembers small details, checks in during difficult moments, and creates a sense of safety for those you care about. This attentiveness is one of your most valued qualities.

You may sometimes hold back before fully opening up, not from fear, but from a natural desire to know that the connection is real. When you do commit emotionally, you bring a warmth and loyalty that is rare and deeply appreciated.`,

      career: `Your head line and fate line together suggest a person with both creative vision and practical follow-through — a combination that serves well in almost any professional path you choose to pursue.

You appear to think strategically, identifying the larger picture while remaining capable of the detail-oriented work that brings ideas to life. Leadership may come naturally to you, though you likely prefer to lead through example and quiet authority rather than loud ambition.

Your career path may not follow a conventional straight line, and that is a strength rather than a limitation. Periods of exploration and redirection are part of how you refine your direction. The fate line's presence suggests that purpose-driven work resonates most deeply with you — when your work feels meaningful, your output rises noticeably.`,

      health: `Your life line reflects a fundamentally strong constitution and good recovery potential. You appear to have natural reserves of energy, though like many thoughtful individuals, you may be prone to carrying emotional weight physically — particularly during periods of uncertainty or overcommitment.

Your wellbeing thrives when you maintain balance between activity and rest, between giving to others and replenishing yourself. You respond well to routines that feel purposeful rather than rigid. Movement that you enjoy — whether walking, yoga, or something creative — will serve you far better than exercise that feels like obligation.

This reading is offered as a reflection, not a medical assessment.`,

      strengths: [
        "You tend to remain calm when facing uncertainty, allowing you to make thoughtful decisions even under pressure.",
        "Your emotional intelligence means you read rooms and relationships with unusual accuracy, making you a trusted confidant.",
        "You bring a natural creativity to problem-solving, often finding approaches that others overlook entirely.",
        "Your loyalty is deep and consistent — when you commit to a person or a cause, you see it through with care.",
        "You possess a quiet resilience that helps you navigate setbacks without losing your fundamental optimism.",
      ],

      growthAreas: [
        "Trust your instincts more often — your first sense of a situation is frequently more accurate than extended analysis.",
        "Practise communicating emotions earlier in relationships rather than waiting until clarity feels complete.",
        "Allow others to support you as generously as you support them; receiving is its own form of strength.",
        "Notice when perfectionism slows you down, and give yourself permission to move forward with good enough.",
        "Protect your energy with the same thoughtfulness you give to others — boundaries are an act of self-respect.",
      ],

      luckyElements: {
        color: "Deep Blue",
        number: "7",
        day: "Thursday",
        trait: "Patience",
      },

      summary: `Your palm reflects a person of genuine depth — someone who leads with curiosity, loves with intention, and grows through reflection. While no palm reading can predict the future with certainty, yours offers an encouraging portrait of resilience, warmth, and quiet purpose.

The strengths visible in your lines are not accidents. They are the result of living thoughtfully and remaining open to growth. Carry that forward with confidence.`,
    },
  },
};

// Preview-only version for the preview page
export const MOCK_REPORT_PENDING: ReportDocument = {
  ...MOCK_REPORT,
  paymentStatus: "pending",
};
