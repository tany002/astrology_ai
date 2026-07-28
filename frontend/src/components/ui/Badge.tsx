import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "purple" | "success" | "muted";
  className?: string;
}

export default function Badge({
  children,
  variant = "gold",
  className,
}: BadgeProps) {
  const variants = {
    gold: "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20",
    purple: "bg-[#6E5BFF]/10 text-[#6E5BFF] border border-[#6E5BFF]/20",
    success: "bg-[#35D07F]/10 text-[#35D07F] border border-[#35D07F]/20",
    muted: "bg-white/5 text-[#A5A8C3] border border-white/10",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wide",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
