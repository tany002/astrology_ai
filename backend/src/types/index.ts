export interface PalmMajorLines {
  heartLine?: { length?: string; depth?: string; curve?: string };
  lifeLine?: { length?: string; depth?: string; curve?: string };
  headLine?: { length?: string; depth?: string; curve?: string };
  fateLine?: { visibility?: string };
}

export interface PalmMounts {
  venus?: string;
  jupiter?: string;
  saturn?: string;
  apollo?: string;
  mercury?: string;
}

export interface PalmAnalysis {
  hand: string;
  confidence: number;
  imageQuality: string;
  palmVisibility?: string;
  majorLines: PalmMajorLines;
  mounts?: PalmMounts;
  overallObservation: string;
}

export interface LuckyElements {
  color: string;
  number: string;
  day: string;
  trait: string;
}

export interface ReportSections {
  personality: string;
  love: string;
  career: string;
  health: string;
  strengths: string[];
  growthAreas: string[];
  luckyElements: LuckyElements;
  summary: string;
}

export interface ReportMetadata {
  reportId: string;
  createdAt: string;
  language: string;
  confidence: number;
  visionModel: string;
  llmModel: string;
  visionPromptVersion: string;
  reportPromptVersion: string;
}

export interface FullReport {
  metadata: ReportMetadata;
  sections: ReportSections;
}

export interface ReportPreview {
  personality: string;
  love: string;
}

export type PaymentStatus = 'pending' | 'paid';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}
