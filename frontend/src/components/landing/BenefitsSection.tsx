"use client";

import { motion } from "framer-motion";
import { Heart, Briefcase, Activity, Star } from "lucide-react";
import { COPY } from "@/constants/copy";
import Card from "@/components/ui/Card";

const ICONS = [Heart, Briefcase, Activity, Star];

export default function BenefitsSection() {
  return (
    <section className="py-24 px-6 bg-[#11152A]/40">
      <div className="max-w-[720px] mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[#D4AF37] text-sm font-medium tracking-widest uppercase mb-3">
            Your Reading Covers
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            {COPY.benefits.heading}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {COPY.benefits.items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card hover className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center mt-0.5">
                    <Icon className="w-5 h-5 text-[#D4AF37]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base mb-1">
                      {item.title}
                    </h3>
                    <p className="text-[#A5A8C3] text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
