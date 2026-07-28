"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, Copy, ArrowRight, Home } from "lucide-react";

interface VerifiedPayment {
  paymentId: string;
  orderId: string;
  timestamp: number;
}

export default function SuccessPage() {
  const router = useRouter();
  const [payment, setPayment] = useState<VerifiedPayment | null>(null);
  const [copiedField, setCopiedField] = useState<"paymentId" | "orderId" | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("verifiedPayment");
    if (!raw) { router.replace("/"); return; }
    try {
      const parsed = JSON.parse(raw) as VerifiedPayment;
      if (!parsed.paymentId || !parsed.orderId) { router.replace("/"); return; }
      setPayment(parsed);
    } catch {
      router.replace("/");
    }
  }, [router]);

  const copy = async (text: string, field: "paymentId" | "orderId") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch { /* ignore */ }
  };

  if (!payment) return null;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
      style={{ background: "linear-gradient(180deg, #070A14 0%, #0B1020 60%, #0D1428 100%)" }}
    >
      <div className="w-full" style={{ maxWidth: 480 }}>

        {/* ── Success emblem ── */}
        <motion.div
          className="flex flex-col items-center text-center mb-8"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative mb-5">
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: "rgba(52,211,153,0.12)" }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <div
              className="relative w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(52,211,153,0.12), rgba(16,185,129,0.06))",
                border: "1.5px solid rgba(52,211,153,0.35)",
                boxShadow: "0 0 48px rgba(52,211,153,0.18)",
              }}
            >
              <CheckCircle2 className="w-9 h-9" style={{ color: "#34D399" }} />
            </div>
          </div>

          <p
            className="font-semibold uppercase"
            style={{ color: "#34D399", fontSize: 11, letterSpacing: "0.22em", marginBottom: 10 }}
          >
            Payment Successful
          </p>
          <h1
            className="font-bold text-white"
            style={{ fontSize: "clamp(26px, 5vw, 36px)", lineHeight: 1.15, marginBottom: 10 }}
          >
            Thank you for your purchase
          </h1>
          <p style={{ color: "#7B89A8", fontSize: 15, lineHeight: 1.7, maxWidth: 380 }}>
            Your ₹5 AI Palm Reading payment has been received. Complete the next step to begin your reading.
          </p>
        </motion.div>

        {/* ── Payment receipt ── */}
        <motion.div
          className="rounded-[18px] overflow-hidden mb-5"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div
            className="px-5 py-3 flex items-center justify-between"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}
          >
            <p style={{ color: "#4B5563", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              Payment Confirmation
            </p>
            <div
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
              style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#34D399" }} />
              <span style={{ color: "#34D399", fontSize: 11, fontWeight: 600 }}>Verified</span>
            </div>
          </div>

          <div className="px-5 py-4 flex flex-col gap-4">
            <ReceiptRow
              label="Payment ID"
              value={payment.paymentId}
              copied={copiedField === "paymentId"}
              onCopy={() => copy(payment.paymentId, "paymentId")}
            />
            <div style={{ height: 1, background: "rgba(255,255,255,0.04)" }} />
            <ReceiptRow
              label="Order ID"
              value={payment.orderId}
              copied={copiedField === "orderId"}
              onCopy={() => copy(payment.orderId, "orderId")}
            />
          </div>
        </motion.div>

        {/* ── Primary CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mb-4"
        >
          <Link
            href="/details"
            className="flex items-center justify-center gap-3 w-full rounded-full font-semibold text-white"
            style={{
              padding: "15px 24px",
              fontSize: 16,
              background: "linear-gradient(135deg, #7C3AED 0%, #8B5CF6 55%, #A78BFA 100%)",
              boxShadow: "0 8px 32px rgba(124,58,237,0.35)",
              textDecoration: "none",
            }}
          >
            Generate My Report
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* ── Secondary ── */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5"
            style={{
              color: "#6B7280",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            <Home className="w-3.5 h-3.5" />
            Return to Home
          </Link>
        </motion.div>

        <motion.p
          className="text-center mt-6"
          style={{ color: "#2D3748", fontSize: 12 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
        >
          Save your Payment ID for reference. Need help?{" "}
          <a
            href="https://wa.me/919019873827"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#4B5563", textDecoration: "underline" }}
          >
            WhatsApp us
          </a>
        </motion.p>
      </div>
    </div>
  );
}

function ReceiptRow({
  label, value, copied, onCopy,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p style={{ color: "#6B7280", fontSize: 12, marginBottom: 3 }}>{label}</p>
        <p className="font-mono font-medium truncate" style={{ color: "#E5E7EB", fontSize: 13 }}>
          {value}
        </p>
      </div>
      <button
        onClick={onCopy}
        className="flex-shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-1.5"
        style={{
          background: "rgba(255,255,255,0.05)",
          color: copied ? "#34D399" : "#6B7280",
          fontSize: 12,
        }}
      >
        <Copy className="w-3.5 h-3.5" />
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
