"use client";

import { motion } from "framer-motion";
import { Heart, Briefcase, Activity, Zap, TrendingUp, Star, Sparkles, BookOpen } from "lucide-react";
import { type ReportSections } from "@/types/report";
import { COPY } from "@/constants/copy";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const SECTION_ICONS = {
  personality: Sparkles,
  love: Heart,
  career: Briefcase,
  health: Activity,
  strengths: Zap,
  growthAreas: TrendingUp,
  luckyElements: Star,
  summary: BookOpen,
};

interface ReportSectionCardProps {
  sectionKey: keyof typeof SECTION_ICONS;
  title: string;
  children: React.ReactNode;
  delay?: number;
}

export function ReportSectionCard({
  sectionKey,
  title,
  children,
  delay = 0,
}: ReportSectionCardProps) {
  const Icon = SECTION_ICONS[sectionKey];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
    >
      <Card className="flex flex-col gap-5">
        {/* Section header */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
            <Icon className="w-4.5 h-4.5 text-[#D4AF37]" strokeWidth={1.5} />
          </div>
          <h2 className="text-white font-bold text-xl">{title}</h2>
        </div>

        {children}
      </Card>
    </motion.div>
  );
}

// ─── Prose section ────────────────────────────────────────────────────────────

export function ProseContent({ text }: { text: string }) {
  const paragraphs = text.split("\n\n").filter(Boolean);
  return (
    <div className="flex flex-col gap-4">
      {paragraphs.map((para, i) => (
        <p key={i} className="text-[#C5C9E0] text-[17px] leading-[1.75]">
          {para}
        </p>
      ))}
    </div>
  );
}

// ─── Strengths grid ───────────────────────────────────────────────────────────

export function StrengthsList({ strengths }: { strengths: string[] }) {
  return (
    <div className="flex flex-col gap-3">
      {strengths.map((item, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#35D07F]/15 border border-[#35D07F]/30 flex items-center justify-center mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#35D07F]" />
          </div>
          <p className="text-[#C5C9E0] text-[16px] leading-[1.65]">{item}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Growth areas ─────────────────────────────────────────────────────────────

export function GrowthList({ areas }: { areas: string[] }) {
  return (
    <div className="flex flex-col gap-3">
      {areas.map((item, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#6E5BFF]/15 border border-[#6E5BFF]/30 flex items-center justify-center mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#6E5BFF]" />
          </div>
          <p className="text-[#C5C9E0] text-[16px] leading-[1.65]">{item}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Lucky elements grid ──────────────────────────────────────────────────────

interface LuckyElementsProps {
  color: string;
  number: string;
  day: string;
  trait: string;
}

export function LuckyElementsGrid({
  color,
  number,
  day,
  trait,
}: LuckyElementsProps) {
  const items = [
    { label: "Lucky Color", value: color, accent: "#D4AF37" },
    { label: "Lucky Number", value: number, accent: "#6E5BFF" },
    { label: "Lucky Day", value: day, accent: "#35D07F" },
    { label: "Trait to Focus On", value: trait, accent: "#D4AF37" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-[#11152A] border border-[#2D355A] rounded-2xl p-4 flex flex-col gap-1.5"
        >
          <p className="text-[#A5A8C3] text-xs font-medium uppercase tracking-wide">
            {item.label}
          </p>
          <p
            className="text-white font-bold text-xl"
            style={{ color: item.accent }}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── Full composed report ─────────────────────────────────────────────────────

export function FullReportBody({ sections }: { sections: ReportSections }) {
  const titles = COPY.report.sectionTitles;

  return (
    <div className="flex flex-col gap-6">
      <ReportSectionCard sectionKey="personality" title={titles.personality} delay={0.05}>
        <ProseContent text={sections.personality} />
      </ReportSectionCard>

      <ReportSectionCard sectionKey="love" title={titles.love} delay={0.1}>
        <ProseContent text={sections.love} />
      </ReportSectionCard>

      <ReportSectionCard sectionKey="career" title={titles.career} delay={0.15}>
        <ProseContent text={sections.career} />
      </ReportSectionCard>

      <ReportSectionCard sectionKey="health" title={titles.health} delay={0.2}>
        <ProseContent text={sections.health} />
      </ReportSectionCard>

      <ReportSectionCard sectionKey="strengths" title={titles.strengths} delay={0.25}>
        <StrengthsList strengths={sections.strengths} />
      </ReportSectionCard>

      <ReportSectionCard sectionKey="growthAreas" title={titles.growthAreas} delay={0.3}>
        <GrowthList areas={sections.growthAreas} />
      </ReportSectionCard>

      <ReportSectionCard sectionKey="luckyElements" title={titles.luckyElements} delay={0.35}>
        <p className="text-[#A5A8C3] text-sm mb-4">
          Traditional palmistry-inspired guidance. Take these as light-hearted reflection.
        </p>
        <LuckyElementsGrid {...sections.luckyElements} />
      </ReportSectionCard>

      <ReportSectionCard sectionKey="summary" title={titles.summary} delay={0.4}>
        <div className="relative">
          <div className="absolute -left-1 top-1 bottom-1 w-0.5 rounded-full bg-gradient-to-b from-[#D4AF37] to-[#D4AF37]/10" />
          <div className="pl-5">
            <ProseContent text={sections.summary} />
          </div>
        </div>
      </ReportSectionCard>
    </div>
  );
}

// ─── Report cover ─────────────────────────────────────────────────────────────

interface ReportCoverProps {
  createdAt: string;
  confidence: number;
}

export function ReportCover({ createdAt, confidence }: ReportCoverProps) {
  const date = new Date(createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div
      className="text-center mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="inline-flex flex-col items-center gap-4">
        {/* Glow emblem */}
        <div
          className="w-20 h-20 rounded-[24px] flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(212,175,55,0.15), rgba(110,91,255,0.1))",
            border: "1px solid rgba(212,175,55,0.2)",
            boxShadow: "0 0 32px rgba(212,175,55,0.15)",
          }}
        >
          <Star className="w-9 h-9 text-[#D4AF37]" strokeWidth={1.5} />
        </div>

        <div>
          <p className="text-[#D4AF37] text-sm font-medium tracking-widest uppercase mb-2">
            astrologer.ai
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            {COPY.report.heading}
          </h1>
          <p className="text-[#A5A8C3] text-sm">{COPY.report.generatedLabel} · {date}</p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="gold">AI Confidence {Math.round(confidence * 100)}%</Badge>
          <Badge variant="muted">8 Sections</Badge>
        </div>
      </div>
    </motion.div>
  );
}
