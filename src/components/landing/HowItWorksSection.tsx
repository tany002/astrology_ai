"use client";

import { motion } from "framer-motion";
import { Upload, Sparkles, FileText } from "lucide-react";
import { COPY } from "@/constants/copy";

const ICONS = [Upload, Sparkles, FileText];

export default function HowItWorksSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-[720px] mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[#D4AF37] text-sm font-medium tracking-widest uppercase mb-3">
            Simple Process
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            {COPY.howItWorks.heading}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
          {/* Connector line on desktop */}
          <div className="hidden sm:block absolute top-10 left-[calc(33%+12px)] right-[calc(33%+12px)] h-px bg-gradient-to-r from-[#2D355A] via-[#D4AF37]/30 to-[#2D355A]" />

          {COPY.howItWorks.steps.map((step, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={step.number}
                className="flex flex-col items-center text-center gap-4"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-[20px] bg-[#171C33] border border-[#2D355A] flex items-center justify-center">
                    <Icon className="w-7 h-7 text-[#D4AF37]" strokeWidth={1.5} />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#D4AF37] text-[#090B16] text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-base mb-1">
                    {step.title}
                  </h3>
                  <p className="text-[#A5A8C3] text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
