"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "lg",
      loading = false,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      "relative inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090B16] disabled:opacity-50 disabled:cursor-not-allowed select-none";

    const variants = {
      primary:
        "bg-[#D4AF37] text-[#090B16] glow-gold-sm hover:glow-gold active:scale-[0.98]",
      secondary:
        "border border-white/20 text-white bg-transparent hover:bg-white/5 active:scale-[0.98]",
      ghost:
        "text-[#A5A8C3] hover:text-white bg-transparent hover:bg-white/5",
    };

    const sizes = {
      sm: "h-10 px-5 text-sm gap-2",
      md: "h-12 px-6 text-base gap-2",
      lg: "h-14 px-8 text-base gap-2",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        transition={{ duration: 0.15 }}
        className={cn(
          base,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        disabled={disabled || loading}
        {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Processing...</span>
          </span>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;
