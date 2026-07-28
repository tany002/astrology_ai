"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { COPY } from "@/constants/copy";
import Card from "@/components/ui/Card";

export default function TestimonialsSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-[720px] mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[#D4AF37] text-sm font-medium tracking-widest uppercase mb-3">
            Reviews
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            {COPY.testimonials.heading}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {COPY.testimonials.items.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card hover className="flex flex-col gap-4 h-full">
                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-[#A5A8C3] text-sm leading-relaxed flex-1">
                  &ldquo;{item.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-2 border-t border-[#2D355A]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37]/30 to-[#6E5BFF]/30 flex items-center justify-center text-white text-xs font-bold">
                    {item.name[0]}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium leading-none">
                      {item.name}
                    </p>
                    <p className="text-[#A5A8C3] text-xs mt-0.5">
                      {item.location}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
