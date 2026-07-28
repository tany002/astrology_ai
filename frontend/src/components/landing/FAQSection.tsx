"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { COPY } from "@/constants/copy";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
            FAQ
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            {COPY.faq.heading}
          </h2>
        </motion.div>

        <div className="flex flex-col gap-3">
          {COPY.faq.items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="bg-[#171C33] border border-[#2D355A] rounded-[20px] overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-6 text-left group"
                  aria-expanded={isOpen}
                >
                  <span className="text-white font-medium text-base group-hover:text-[#D4AF37] transition-colors duration-150">
                    {item.q}
                  </span>
                  <span className="flex-shrink-0 w-7 h-7 rounded-full border border-[#2D355A] flex items-center justify-center group-hover:border-[#D4AF37]/40 transition-colors duration-150">
                    {isOpen ? (
                      <Minus className="w-3.5 h-3.5 text-[#D4AF37]" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 text-[#A5A8C3]" />
                    )}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <p className="px-6 pb-6 text-[#A5A8C3] text-sm leading-relaxed">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
