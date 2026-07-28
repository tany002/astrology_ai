"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Phone, ArrowRight, Loader2, ShieldCheck } from "lucide-react";

interface VerifiedPayment {
  paymentId: string;
  orderId: string;
  timestamp: number;
}

export default function DetailsPage() {
  const router = useRouter();
  const [payment, setPayment] = useState<VerifiedPayment | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!payment || !name.trim() || !email.trim() || !phone.trim() || submitting) return;

      setSubmitting(true);

      sessionStorage.setItem(
        "customerDetails",
        JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim() })
      );

      router.push("/whatsapp");
    },
    [payment, name, email, phone, submitting, router]
  );

  if (!payment) return null;

  const isValid = name.trim() && email.trim() && phone.trim();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
      style={{ background: "linear-gradient(180deg, #070A14 0%, #0B1020 60%, #0D1428 100%)" }}
    >
      <div className="w-full" style={{ maxWidth: 460 }}>

        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-5">
            <StepDot done label="1" />
            <div className="w-8 h-px" style={{ background: "rgba(139,92,246,0.3)" }} />
            <StepDot active label="2" />
            <div className="w-8 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            <StepDot label="3" />
          </div>

          <p
            className="font-semibold uppercase"
            style={{ color: "#A78BFA", fontSize: 11, letterSpacing: "0.22em", marginBottom: 10 }}
          >
            One more step
          </p>
          <h1
            className="font-bold text-white"
            style={{ fontSize: "clamp(24px, 4.5vw, 34px)", lineHeight: 1.2, marginBottom: 10 }}
          >
            Where should we send your report?
          </h1>
          <p style={{ color: "#7B89A8", fontSize: 14, lineHeight: 1.7 }}>
            We&apos;ll use these details to deliver your reading and send you updates on WhatsApp.
          </p>
        </motion.div>

        {/* Form card */}
        <motion.div
          className="rounded-[22px] overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #0F1526 0%, #0B1020 100%)",
            border: "1px solid rgba(139,92,246,0.15)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">

            {/* Full Name */}
            <FormField
              icon={<User className="w-4 h-4" />}
              label="Full Name"
              required
              input={
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your full name"
                  disabled={submitting}
                  className="w-full text-white bg-transparent outline-none"
                  style={{ fontSize: 14 }}
                />
              }
            />

            {/* Email */}
            <FormField
              icon={<Mail className="w-4 h-4" />}
              label="Email Address"
              required
              input={
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  disabled={submitting}
                  className="w-full text-white bg-transparent outline-none"
                  style={{ fontSize: 14 }}
                />
              }
            />

            {/* WhatsApp */}
            <FormField
              icon={<WhatsAppIcon />}
              label="WhatsApp Number"
              required
              hint="We'll deliver your report here"
              input={
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+91 98765 43210"
                  disabled={submitting}
                  className="w-full text-white bg-transparent outline-none"
                  style={{ fontSize: 14 }}
                />
              }
            />

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={!isValid || submitting}
              whileHover={isValid && !submitting ? { scale: 1.02 } : {}}
              whileTap={isValid && !submitting ? { scale: 0.98 } : {}}
              className="w-full rounded-full font-semibold text-white flex items-center justify-center gap-2.5"
              style={{
                padding: "14px 24px",
                fontSize: 15,
                background: isValid && !submitting
                  ? "linear-gradient(135deg, #7C3AED 0%, #8B5CF6 55%, #A78BFA 100%)"
                  : "rgba(139,92,246,0.25)",
                boxShadow: isValid && !submitting ? "0 8px 28px rgba(124,58,237,0.35)" : "none",
                cursor: isValid && !submitting ? "pointer" : "not-allowed",
                marginTop: 4,
                transition: "all 0.2s",
              }}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Opening WhatsApp...
                </>
              ) : (
                <>
                  Send My Palm on WhatsApp
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>

            {/* Trust note */}
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: "#374151" }} />
              <p style={{ color: "#374151", fontSize: 12 }}>
                Your details are private and never shared
              </p>
            </div>
          </form>
        </motion.div>

        {/* Palm tips */}
        <motion.div
          className="rounded-[16px] p-4 mt-4"
          style={{
            background: "rgba(52,211,153,0.04)",
            border: "1px solid rgba(52,211,153,0.1)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <p style={{ color: "#34D399", fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
            📸 Tips for the best reading
          </p>
          <div className="flex flex-col gap-1.5">
            {TIPS.map((tip) => (
              <div key={tip} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "#34D399", opacity: 0.5 }} />
                <p style={{ color: "#9CA3AF", fontSize: 13 }}>{tip}</p>
              </div>
            ))}
          </div>
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
        border: `1.5px solid ${done ? "rgba(52,211,153,0.4)" : active ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.08)"}`,
        color: done ? "#34D399" : active ? "#A78BFA" : "#4B5563",
      }}
    >
      {done ? "✓" : label}
    </div>
  );
}

function FormField({
  icon, label, required, hint, input,
}: {
  icon: React.ReactNode;
  label: string;
  required?: boolean;
  hint?: string;
  input: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label style={{ color: "#9CA3AF", fontSize: 13, fontWeight: 500 }}>
          {label}{" "}
          {required && <span style={{ color: "#F87171" }}>*</span>}
        </label>
        {hint && <span style={{ color: "#4B5563", fontSize: 11 }}>{hint}</span>}
      </div>
      <div
        className="flex items-center gap-3 rounded-xl px-3.5 py-3 transition-colors"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
        onFocus={() => {}}
      >
        <span style={{ color: "#4B5563", flexShrink: 0 }}>{icon}</span>
        {input}
      </div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#4B5563">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const TIPS = [
  "Good lighting — natural or bright indoor light",
  "Both palms clearly visible, fingers spread",
  "No filters, no edits — natural photo",
  "High resolution — avoid zooming in",
];
