// ─── Report Metadata ────────────────────────────────────────────────────────

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

// ─── Lucky Elements ──────────────────────────────────────────────────────────

export interface LuckyElements {
  color: string;
  number: string;
  day: string;
  trait: string;
}

// ─── Report Sections ─────────────────────────────────────────────────────────

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

// ─── Full Report ─────────────────────────────────────────────────────────────

export interface FullReport {
  metadata: ReportMetadata;
  sections: ReportSections;
}

// ─── Preview ─────────────────────────────────────────────────────────────────

export interface ReportPreview {
  personality: string;
  love: string;
}

// ─── Top-level Report Document ───────────────────────────────────────────────

export type PaymentStatus = "pending" | "paid";

export interface ReportDocument {
  reportId: string;
  imageUrl: string;
  preview: ReportPreview;
  fullReport: FullReport;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

// ─── Scan Step ───────────────────────────────────────────────────────────────

export interface ScanStep {
  label: string;
  duration: number; // ms until this step completes
}
