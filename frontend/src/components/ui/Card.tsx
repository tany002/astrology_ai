"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hover = false, glow = false, className, children, ...props }, ref) => {
    const base =
      "bg-[#171C33] border border-[#2D355A] rounded-[20px] p-6";

    if (hover) {
      return (
        <motion.div
          ref={ref}
          whileHover={{ y: -2, borderColor: "rgba(212,175,55,0.25)" }}
          transition={{ duration: 0.2 }}
          className={cn(base, glow && "glow-gold-sm", className)}
          // Spread only data/aria attributes to avoid DOM type conflicts
          {...(Object.fromEntries(
            Object.entries(props).filter(([k]) => k.startsWith("data-") || k.startsWith("aria-"))
          ))}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(base, glow && "glow-gold-sm", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
