"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, Clock, Loader2, Heart, Star, Shield, Home } from "lucide-react";

interface CustomerDetails { name: string; email: string; phone: string; }
interface VerifiedPayment  { paymentId: string; orderId: string; }

export default function PreparingPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerDetails | null>(null);
  const [, setPayment] = useState<VerifiedPayment | null>(null);

  useEffect(() => {
    const rawPayment  = sessionStorage.getItem("verifiedPayment");
    const rawCustomer = sessionStorage.getItem("customerDetails");
    if (!rawPayment) { router.replace("/"); return; }
    try {
      const p = JSON.parse(rawPayment) as VerifiedPayment;
      if (!p.paymentId) { router.replace("/"); return; }
      setPayment(p);
      if (rawCustomer) setCustomer(JSON.parse(rawCustomer) as CustomerDetails);
    } catch { router.replace("/"); }
  }, [router]);

  const firstName = customer?.name?.split(" ")[0] ?? "there";

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(180deg, #070A14 0%, #0B1020 35%, #0D1428 100%)" }}
    >

      {/* ════════════════════════════════════════════════════════════
          SECTION 1 — Confirmation header
      ════════════════════════════════════════════════════════════ */}
      <section className="flex flex-col items-center text-center px-6 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
          style={{ maxWidth: 560 }}
        >
          {/* Gold emblem */}
          <div className="relative mb-6" style={{ width: 80, height: 80 }}>
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: "rgba(212,175,55,0.12)" }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <div
              className="relative w-full h-full rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.06))",
                border: "1.5px solid rgba(212,175,55,0.35)",
                boxShadow: "0 0 40px rgba(212,175,55,0.15)",
              }}
            >
              <Star className="w-9 h-9" style={{ color: "#D4AF37" }} />
            </div>
          </div>

          <p
            className="font-semibold uppercase"
            style={{ color: "#D4AF37", fontSize: 11, letterSpacing: "0.22em", marginBottom: 12 }}
          >
            All Steps Complete
          </p>
          <h1
            className="font-bold text-white"
            style={{ fontSize: "clamp(28px, 5.5vw, 42px)", lineHeight: 1.1, marginBottom: 14 }}
          >
            Your report is being
            <br />
            <span style={{
              background: "linear-gradient(120deg, #ECD87A 0%, #D4AF37 50%, #F0D060 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              prepared, {firstName}
            </span>
          </h1>
          <p style={{ color: "#7B89A8", fontSize: "clamp(14px, 2vw, 16px)", lineHeight: 1.7, maxWidth: 420 }}>
            Thank you for your purchase. Everything is confirmed and your personalized palm reading is now in progress.
          </p>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 2 — Status checklist
      ════════════════════════════════════════════════════════════ */}
      <section className="px-6 pb-14 flex justify-center">
        <motion.div
          className="w-full rounded-[22px] overflow-hidden"
          style={{
            maxWidth: 540,
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div
            className="px-5 py-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}
          >
            <p style={{ color: "#4B5563", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              Order Status
            </p>
          </div>
          <div className="px-5 py-5 flex flex-col gap-0">
            {STATUS_STEPS.map((step, i) => (
              <StatusRow key={step.label} {...step} isLast={i === STATUS_STEPS.length - 1} index={i} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 3 — Delivery timeline
      ════════════════════════════════════════════════════════════ */}
      <section className="px-6 pb-14 flex justify-center">
        <motion.div
          className="w-full rounded-[20px] flex items-center gap-4 px-5 py-4"
          style={{
            maxWidth: 540,
            background: "rgba(52,211,153,0.05)",
            border: "1px solid rgba(52,211,153,0.15)",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}
          >
            <Clock className="w-5 h-5" style={{ color: "#34D399" }} />
          </div>
          <div>
            <p className="text-white font-semibold" style={{ fontSize: 15 }}>
              Delivery within 24 hours
            </p>
            <p style={{ color: "#6B7280", fontSize: 13, lineHeight: 1.5 }}>
              Your reading will be sent directly to your WhatsApp number.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 4 — Trust
      ════════════════════════════════════════════════════════════ */}
      <section className="px-6 pb-16 flex justify-center">
        <motion.div
          className="w-full grid gap-3"
          style={{
            maxWidth: 700,
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          {TRUST_ITEMS.map((item, i) => (
            <motion.div
              key={item.label}
              className="rounded-[16px] p-4 flex items-start gap-3"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + i * 0.07 }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(212,175,55,0.08)" }}
              >
                {item.icon}
              </div>
              <div>
                <p className="text-white font-semibold" style={{ fontSize: 13 }}>{item.label}</p>
                <p style={{ color: "#6B7280", fontSize: 12, lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          DIVIDER — Transition into upgrade section
      ════════════════════════════════════════════════════════════ */}
      <motion.div
        className="px-6 pb-14 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div
          className="w-full flex flex-col items-center gap-4 rounded-[20px] px-8 py-6 text-center"
          style={{
            maxWidth: 560,
            background: "rgba(212,175,55,0.04)",
            border: "1px solid rgba(212,175,55,0.12)",
          }}
        >
          <p style={{ color: "#D4AF37", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase" }}>
            While your report is being prepared
          </p>
          <p className="text-white font-bold" style={{ fontSize: "clamp(18px, 3vw, 22px)", lineHeight: 1.3 }}>
            Would you like to enhance your reading?
          </p>
          <p style={{ color: "#7B89A8", fontSize: 14, lineHeight: 1.7, maxWidth: 380 }}>
            Your ₹5 basic report is confirmed and will be delivered. You also have the option to unlock a far more comprehensive reading — at a special launch price.
          </p>
        </div>
      </motion.div>

      {/* ════════════════════════════════════════════════════════════
          SECTION 5 — Report comparison
      ════════════════════════════════════════════════════════════ */}
      <section className="px-6 pb-14 flex justify-center">
        <motion.div
          className="w-full"
          style={{ maxWidth: 700 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
        >
          <p className="text-center font-bold text-white mb-6" style={{ fontSize: "clamp(20px, 3.5vw, 26px)" }}>
            What&apos;s included in each report
          </p>
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            {/* Basic report */}
            <div
              className="rounded-[20px] p-5"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white font-bold" style={{ fontSize: 16 }}>Basic Report</p>
                  <p style={{ color: "#4B5563", fontSize: 13 }}>Your current purchase</p>
                </div>
                <div
                  className="rounded-full px-3 py-1"
                  style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}
                >
                  <span style={{ color: "#34D399", fontSize: 12, fontWeight: 600 }}>₹5</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {BASIC_FEATURES.map((f) => (
                  <div key={f} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#34D399", opacity: 0.7 }} />
                    <span style={{ color: "#9CA3AF", fontSize: 13 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Complete Destiny Report */}
            <div
              className="rounded-[20px] p-5 relative overflow-hidden"
              style={{
                background: "linear-gradient(145deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.03) 100%)",
                border: "1.5px solid rgba(212,175,55,0.3)",
                boxShadow: "0 0 40px rgba(212,175,55,0.06)",
              }}
            >
              {/* "Most Popular" badge */}
              <div
                className="absolute top-0 right-0 rounded-bl-[16px] rounded-tr-[18px] px-3 py-1.5"
                style={{ background: "rgba(212,175,55,0.15)", borderBottom: "1px solid rgba(212,175,55,0.2)", borderLeft: "1px solid rgba(212,175,55,0.2)" }}
              >
                <span style={{ color: "#D4AF37", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em" }}>✨ Complete</span>
              </div>

              <div className="flex items-center justify-between mb-4 pr-16">
                <div>
                  <p className="text-white font-bold" style={{ fontSize: 16 }}>Complete Destiny Report</p>
                  <p style={{ color: "#D4AF37", fontSize: 13, opacity: 0.8 }}>Full life analysis</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {DESTINY_FEATURES.map((f) => (
                  <div key={f.label} className="flex items-start gap-2.5">
                    <span style={{ fontSize: 14, flexShrink: 0 }}>{f.icon}</span>
                    <span style={{ color: "#C5C9E0", fontSize: 13 }}>{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 6 — Premium feature cards
      ════════════════════════════════════════════════════════════ */}
      <section className="px-6 pb-14 flex justify-center">
        <motion.div
          className="w-full"
          style={{ maxWidth: 720 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
        >
          <p className="text-center font-bold text-white mb-6" style={{ fontSize: "clamp(18px, 3vw, 22px)" }}>
            What the Complete Destiny Report covers
          </p>
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))" }}
          >
            {PREMIUM_FEATURES.map((feature, i) => (
              <motion.div
                key={feature.label}
                className="rounded-[16px] p-4 flex flex-col items-start gap-2"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(212,175,55,0.1)",
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.05 }}
              >
                <span style={{ fontSize: 22 }}>{feature.icon}</span>
                <p className="text-white font-semibold" style={{ fontSize: 13, lineHeight: 1.3 }}>{feature.label}</p>
                <p style={{ color: "#4B5563", fontSize: 12, lineHeight: 1.5 }}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 7 — Launch pricing + CTA
      ════════════════════════════════════════════════════════════ */}
      <section className="px-6 pb-10 flex justify-center">
        <motion.div
          className="w-full rounded-[28px] overflow-hidden"
          style={{
            maxWidth: 560,
            background: "linear-gradient(160deg, rgba(212,175,55,0.1) 0%, rgba(212,175,55,0.04) 60%, rgba(139,92,246,0.05) 100%)",
            border: "1.5px solid rgba(212,175,55,0.25)",
            boxShadow: "0 0 60px rgba(212,175,55,0.08)",
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <div className="p-6 sm:p-8 flex flex-col items-center text-center">

            {/* Pricing */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-5"
              style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)" }}
            >
              <span style={{ color: "#D4AF37", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" }}>
                🎉 Special Launch Price
              </span>
            </div>

            <div className="flex items-end justify-center gap-3 mb-2">
              <span
                style={{ color: "#E5E7EB", fontSize: "clamp(40px, 8vw, 56px)", fontWeight: 800, lineHeight: 1 }}
              >
                ₹99
              </span>
              <div className="pb-2">
                <p style={{ color: "#4B5563", fontSize: 16, textDecoration: "line-through" }}>₹499</p>
                <p style={{ color: "#34D399", fontSize: 12, fontWeight: 600 }}>80% OFF</p>
              </div>
            </div>
            <p style={{ color: "#6B7280", fontSize: 13, marginBottom: 24 }}>
              One-time payment · Report on WhatsApp within 24 hours
            </p>

            {/* Primary CTA */}
            <Link
              href="/upgrade"
              className="w-full rounded-full font-bold text-white flex items-center justify-center gap-2"
              style={{
                padding: "16px 24px",
                fontSize: 16,
                background: "linear-gradient(135deg, #B8962E 0%, #D4AF37 50%, #ECD87A 100%)",
                boxShadow: "0 8px 32px rgba(212,175,55,0.3), 0 2px 8px rgba(0,0,0,0.3)",
                textDecoration: "none",
                marginBottom: 12,
                color: "#0B0D14",
              }}
            >
              ✨ Unlock Complete Destiny Report
            </Link>

            {/* Secondary CTA */}
            <button
              onClick={() => {}}
              className="w-full rounded-full font-medium"
              style={{
                padding: "12px 24px",
                fontSize: 13,
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#4B5563",
                cursor: "pointer",
              }}
            >
              Continue with my Basic Report
            </button>

            <p style={{ color: "#2D3748", fontSize: 12, marginTop: 14, lineHeight: 1.6 }}>
              Your ₹5 basic report is being prepared regardless. This is optional.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Home link */}
      <div className="pb-16 text-center px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2"
          style={{ color: "#1F2937", fontSize: 13, textDecoration: "none" }}
        >
          <Home className="w-3.5 h-3.5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusRow({
  icon, label, sublabel, state, isLast, index,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  state: "done" | "pending";
  isLast: boolean;
  index: number;
}) {
  return (
    <motion.div
      className="flex gap-4"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.22 + index * 0.08 }}
    >
      {/* Connector line + icon */}
      <div className="flex flex-col items-center flex-shrink-0" style={{ width: 20 }}>
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center"
          style={{
            background: state === "done" ? "rgba(52,211,153,0.12)" : "rgba(255,255,255,0.04)",
            border: `1.5px solid ${state === "done" ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.08)"}`,
          }}
        >
          {state === "done" ? (
            <CheckCircle2 className="w-3 h-3" style={{ color: "#34D399" }} />
          ) : (
            <Loader2 className="w-3 h-3 animate-spin" style={{ color: "#4B5563" }} />
          )}
        </div>
        {!isLast && (
          <div className="flex-1 mt-1" style={{ width: 1.5, minHeight: 20, background: "rgba(255,255,255,0.04)" }} />
        )}
      </div>

      {/* Text */}
      <div style={{ paddingBottom: isLast ? 0 : 16 }}>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 16 }}>{icon}</span>
          <p
            className="font-semibold"
            style={{ fontSize: 14, color: state === "done" ? "#E5E7EB" : "#4B5563" }}
          >
            {label}
          </p>
        </div>
        {sublabel && (
          <p style={{ color: "#374151", fontSize: 12, lineHeight: 1.5, marginTop: 2 }}>{sublabel}</p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATUS_STEPS = [
  { icon: "✅", label: "Payment Received",       sublabel: "₹5 payment verified and confirmed",         state: "done"    as const },
  { icon: "✅", label: "Details Received",        sublabel: "Your name, email and phone are saved",      state: "done"    as const },
  { icon: "✅", label: "WhatsApp Request Started",sublabel: "Palm photo request sent to your WhatsApp",  state: "done"    as const },
  { icon: "⏳", label: "Report Being Prepared",   sublabel: "Our expert is reviewing your palm photos",  state: "pending" as const },
  { icon: "⏳", label: "Delivery within 24 hours",sublabel: "Your reading will arrive on WhatsApp",      state: "pending" as const },
];

const TRUST_ITEMS = [
  {
    icon: <Shield className="w-4.5 h-4.5" style={{ color: "#D4AF37" }} />,
    label: "100% Private",
    desc: "Your photos are only used for your reading.",
  },
  {
    icon: <Heart className="w-4.5 h-4.5" style={{ color: "#D4AF37" }} />,
    label: "Expert Crafted",
    desc: "Personally written — not auto-generated.",
  },
  {
    icon: <Star className="w-4.5 h-4.5" style={{ color: "#D4AF37" }} />,
    label: "Satisfaction Guarantee",
    desc: "Not happy? We refund, no questions asked.",
  },
];

const BASIC_FEATURES = [
  "Personality overview",
  "Love & relationship summary",
  "Career direction",
  "General health notes",
];

const DESTINY_FEATURES = [
  { icon: "❤️", label: "Love & Marriage compatibility" },
  { icon: "💰", label: "Wealth lines & financial destiny" },
  { icon: "💼", label: "Career path & purpose analysis" },
  { icon: "🏡", label: "Vastu & living environment" },
  { icon: "🔢", label: "Numerology alignment" },
  { icon: "⭐", label: "Your lucky years & timing" },
  { icon: "🛡", label: "Personalized remedies & guidance" },
  { icon: "✨", label: "Life mission & soul purpose" },
];

const PREMIUM_FEATURES = [
  { icon: "❤️", label: "Love & Marriage",    desc: "Compatibility & relationship destiny" },
  { icon: "💰", label: "Wealth Lines",       desc: "Financial patterns & opportunities" },
  { icon: "💼", label: "Career & Purpose",   desc: "Your professional path and calling" },
  { icon: "🏡", label: "Vastu Reading",      desc: "Home & environment alignment" },
  { icon: "🔢", label: "Numerology",         desc: "Numbers that govern your life" },
  { icon: "⭐", label: "Lucky Years",        desc: "When to act and when to rest" },
  { icon: "🛡", label: "Remedies",           desc: "Personalized guidance to improve fate" },
  { icon: "✨", label: "Soul Purpose",       desc: "Your life's deeper meaning" },
];
