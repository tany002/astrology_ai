"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Lock } from "lucide-react";
import { COPY } from "@/constants/copy";
import { MOCK_REPORT_PENDING } from "@/lib/mockData";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function PreviewPage() {
  const report = MOCK_REPORT_PENDING;
  const { preview } = report;

  return (
    <main className="min-h-screen px-6 py-28">
      <div className="max-w-[720px] mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[#D4AF37] text-sm font-medium tracking-widest uppercase mb-2">
            Your Reading is Ready
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            {COPY.preview.heading}
          </h1>
          <p className="text-[#A5A8C3] text-base">
            {COPY.preview.subheading}
          </p>
        </motion.div>

        {/* Preview cards */}
        <div className="flex flex-col gap-5 mb-8">
          {/* Personality — fully visible */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <p className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase mb-3">
                {COPY.report.sectionTitles.personality}
              </p>
              <p className="text-white text-base leading-[1.75]">
                {preview.personality}
              </p>
            </Card>
          </motion.div>

          {/* Love — first line visible, then blurred */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="overflow-hidden">
              <p className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase mb-3">
                {COPY.report.sectionTitles.love}
              </p>
              <div className="relative">
                <p className="text-white text-base leading-[1.75]">
                  {preview.love}
                </p>
                {/* Blur fade over bottom of love section */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-12"
                  style={{
                    background:
                      "linear-gradient(to bottom, transparent, #171C33)",
                  }}
                />
              </div>
            </Card>
          </motion.div>

          {/* Career — fully blurred */}
          <BlurredCard
            title={COPY.report.sectionTitles.career}
            delay={0.3}
          />

          {/* Health — fully blurred */}
          <BlurredCard
            title={COPY.report.sectionTitles.health}
            delay={0.4}
          />

          {/* Strengths — fully blurred */}
          <BlurredCard
            title={COPY.report.sectionTitles.strengths}
            delay={0.5}
          />
        </div>

        {/* Sticky CTA */}
        <motion.div
          className="sticky bottom-6 z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <div className="bg-[#090B16]/80 backdrop-blur-md border border-[#2D355A] rounded-[24px] p-5 flex flex-col sm:flex-row items-center gap-4 shadow-2xl">
            <div className="flex-1 text-center sm:text-left">
              <p className="text-white font-semibold text-base">
                {COPY.preview.unlockCta}
              </p>
              <p className="text-[#D4AF37] text-sm font-medium mt-0.5">
                {COPY.preview.price}
              </p>
            </div>
            <Link href={`/report/${report.reportId}`} className="w-full sm:w-auto">
              <Button fullWidth className="sm:w-auto whitespace-nowrap">
                Unlock Now
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

// ─── Blurred placeholder card ─────────────────────────────────────────────────

function BlurredCard({ title, delay }: { title: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="relative overflow-hidden">
        <p className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase mb-3">
          {title}
        </p>
        {/* Fake blurred text lines */}
        <div className="flex flex-col gap-2 relative">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-4 rounded-full bg-white/10 animate-shimmer"
              style={{ width: i === 2 ? "65%" : "100%" }}
            />
          ))}
          {/* Blur overlay */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2"
            style={{
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              background: "rgba(23,28,51,0.3)",
              borderRadius: 12,
            }}
          >
            <Lock className="w-4 h-4 text-[#A5A8C3]" />
            <span className="text-[#A5A8C3] text-xs">
              {COPY.preview.blurLabel}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
