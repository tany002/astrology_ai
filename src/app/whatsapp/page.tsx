"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface VerifiedPayment {
  paymentId: string;
  orderId: string;
}

interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
}

const WHATSAPP_BUSINESS = "919019873827";

function buildMessage(payment: VerifiedPayment, customer: CustomerDetails): string {
  return `Hi Astrologer AI 👋

I have completed my ₹5 AI Palm Reading payment.

Payment ID:
${payment.paymentId}

Order ID:
${payment.orderId}

Name:
${customer.name}

Email:
${customer.email}

Phone:
${customer.phone}

I am attaching clear photos of both my palms for analysis.

Thank you.`;
}

export default function WhatsAppPage() {
  const router = useRouter();
  const [payment, setPayment] = useState<VerifiedPayment | null>(null);
  const [customer, setCustomer] = useState<CustomerDetails | null>(null);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const rawPayment = sessionStorage.getItem("verifiedPayment");
    const rawCustomer = sessionStorage.getItem("customerDetails");

    if (!rawPayment || !rawCustomer) {
      router.replace("/");
      return;
    }

    try {
      const p = JSON.parse(rawPayment) as VerifiedPayment;
      const c = JSON.parse(rawCustomer) as CustomerDetails;

      if (!p.paymentId || !p.orderId || !c.name) {
        router.replace("/");
        return;
      }

      setPayment(p);
      setCustomer(c);
    } catch {
      router.replace("/");
    }
  }, [router]);

  const handleOpenWhatsApp = useCallback(() => {
    if (!payment || !customer) return;

    const message = buildMessage(payment, customer);
    const url = `https://wa.me/${WHATSAPP_BUSINESS}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank", "noopener,noreferrer");
    setOpened(true);
  }, [payment, customer]);

  const handleContinue = useCallback(() => {
    router.push("/preparing");
  }, [router]);

  if (!payment || !customer) return null;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
      style={{ background: "linear-gradient(180deg, #070A14 0%, #0B1020 60%, #0D1428 100%)" }}
    >
      <div className="w-full" style={{ maxWidth: 480 }}>

        {/* Step indicator */}
        <motion.div
          className="flex items-center justify-center gap-2 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <StepDot done label="1" />
          <div className="w-6 h-px" style={{ background: "rgba(52,211,153,0.4)" }} />
          <StepDot done label="2" />
          <div className="w-6 h-px" style={{ background: "rgba(139,92,246,0.4)" }} />
          <StepDot active label="3" />
          <div className="w-6 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          <StepDot label="4" />
        </motion.div>

        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <p
            className="font-semibold uppercase"
            style={{ color: "#A78BFA", fontSize: 11, letterSpacing: "0.22em", marginBottom: 10 }}
          >
            Step 3 of 4
          </p>
          <h1
            className="font-bold text-white"
            style={{ fontSize: "clamp(24px, 4.5vw, 34px)", lineHeight: 1.2, marginBottom: 10 }}
          >
            Send your palm photos
          </h1>
          <p style={{ color: "#7B89A8", fontSize: 15, lineHeight: 1.7 }}>
            Open WhatsApp and send clear photos of both your palms. Your details and payment reference are pre-filled.
          </p>
        </motion.div>

        {/* WhatsApp card */}
        <motion.div
          className="rounded-[22px] overflow-hidden mb-4"
          style={{
            background: "linear-gradient(160deg, #0F1526 0%, #0B1020 100%)",
            border: "1px solid rgba(37,211,102,0.18)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.45)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div
            className="px-6 pt-5 pb-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            <p style={{ color: "#4B5563", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
              Pre-filled message includes
            </p>
            <div className="flex flex-col gap-2">
              {PREFILL_ITEMS.map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#25D366" }} />
                  <span style={{ color: "#9CA3AF", fontSize: 13 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5">
            <motion.button
              onClick={handleOpenWhatsApp}
              whileHover={{ scale: 1.02, boxShadow: "0 0 32px rgba(37,211,102,0.25)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-full font-semibold text-white flex items-center justify-center gap-2.5"
              style={{
                padding: "14px 20px",
                fontSize: 15,
                background: "linear-gradient(135deg, #128C7E 0%, #25D366 100%)",
                boxShadow: "0 6px 24px rgba(37,211,102,0.25)",
                border: "none",
                cursor: "pointer",
              }}
            >
              <WhatsAppIcon />
              {opened ? "Re-open WhatsApp" : "Open WhatsApp Now"}
            </motion.button>

            {/* Palm photo tips */}
            <div
              className="rounded-[14px] p-4 mt-4"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p style={{ color: "#6B7280", fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
                📸 For the best reading
              </p>
              <div className="grid gap-1.5" style={{ gridTemplateColumns: "1fr 1fr" }}>
                {PHOTO_TIPS.map((tip) => (
                  <div key={tip} className="flex items-start gap-1.5">
                    <div className="w-1 h-1 rounded-full flex-shrink-0 mt-1.5" style={{ background: "#6B7280" }} />
                    <span style={{ color: "#6B7280", fontSize: 12, lineHeight: 1.5 }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Continue CTA — visible after opening or as alternative */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: opened ? 1 : 0.5 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-3"
        >
          <motion.button
            onClick={handleContinue}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-full font-semibold text-white flex items-center justify-center gap-2"
            style={{
              padding: "13px 24px",
              fontSize: 14,
              background: opened
                ? "linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)"
                : "rgba(255,255,255,0.05)",
              border: opened ? "none" : "1px solid rgba(255,255,255,0.08)",
              boxShadow: opened ? "0 6px 20px rgba(124,58,237,0.3)" : "none",
              cursor: "pointer",
            }}
          >
            {opened ? (
              <>
                I&apos;ve sent my photos — Continue
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              "Skip for now — Continue"
            )}
          </motion.button>

          {!opened && (
            <p className="text-center" style={{ color: "#374151", fontSize: 12, lineHeight: 1.6 }}>
              Please send photos before continuing so we can prepare your report.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepDot({ label, done, active }: { label: string; done?: boolean; active?: boolean }) {
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
      style={{
        background: done
          ? "rgba(52,211,153,0.15)"
          : active
          ? "rgba(139,92,246,0.2)"
          : "rgba(255,255,255,0.04)",
        border: `1.5px solid ${done ? "rgba(52,211,153,0.45)" : active ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.08)"}`,
        color: done ? "#34D399" : active ? "#A78BFA" : "#4B5563",
      }}
    >
      {done ? "✓" : label}
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const PREFILL_ITEMS = [
  "Payment ID & Order ID",
  "Your name, email & phone",
  "Palm photo instructions",
];

const PHOTO_TIPS = [
  "Good lighting",
  "Both palms",
  "No filters",
  "Clear & focused",
];
