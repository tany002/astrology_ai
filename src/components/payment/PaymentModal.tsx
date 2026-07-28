"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, User, Phone, AlertCircle, Loader2, Lock, ShieldCheck } from "lucide-react";
import { createSimpleOrder, verifySimplePayment, ApiError } from "@/lib/api";


type ModalStep = "form" | "creating" | "verifying" | "error";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<ModalStep>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    if (step === "creating" || step === "verifying") return;
    setStep("form");
    setError(null);
    onClose();
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim() || !email.trim()) return;

      setStep("creating");
      setError(null);

      try {
        const order = await createSimpleOrder({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
        });

        if (!window.Razorpay) {
          throw new Error("Payment gateway not loaded. Please refresh the page and try again.");
        }

        const rzp = new window.Razorpay({
          key: order.key,
          amount: order.amount,
          currency: order.currency,
          order_id: order.orderId,
          name: "astrologer.ai",
          description: "AI Palm Reading — ₹5 Launch Offer",
          prefill: {
            name: name.trim(),
            email: email.trim(),
            contact: phone.trim() || undefined,
          },
          theme: { color: "#8B5CF6" },
          modal: {
            confirm_close: true,
            ondismiss: () => {
              setStep("form");
              setError("Payment was cancelled. You can try again whenever you're ready.");
            },
          },
          handler: async (response: RazorpayPaymentResponse) => {
            setStep("verifying");
            try {
              const verified = await verifySimplePayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              // Store verified payment in sessionStorage (required to access /success)
              sessionStorage.setItem(
                "verifiedPayment",
                JSON.stringify({
                  paymentId: verified.paymentId,
                  orderId: verified.orderId,
                  name: name.trim(),
                  email: email.trim(),
                  timestamp: Date.now(),
                })
              );

              router.push("/success");
            } catch {
              setStep("error");
              setError(
                "Payment was received but verification failed. Please contact support with your Payment ID: " +
                  response.razorpay_payment_id
              );
            }
          },
        });

        rzp.open();

        // Step reverts to "form" if modal dismissed (handled by ondismiss above)
        // If modal is still open, user sees Razorpay UI
        setStep("form"); // Reset form step so it's ready if user cancels
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : "Failed to start payment. Please try again.";
        setStep("error");
        setError(message);
      }
    },
    [name, email, phone, router]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{ background: "rgba(4, 6, 16, 0.85)", backdropFilter: "blur(8px)" }}
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full z-10"
            style={{ maxWidth: 440 }}
            initial={{ y: 48, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 48, opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="rounded-[28px] overflow-hidden"
              style={{
                background: "linear-gradient(160deg, #0F1526 0%, #0B1020 100%)",
                border: "1px solid rgba(139, 92, 246, 0.2)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(139,92,246,0.08)",
              }}
            >
              {/* Header */}
              <div
                className="px-6 pt-6 pb-5"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p
                      className="font-semibold uppercase"
                      style={{ color: "#A78BFA", fontSize: 11, letterSpacing: "0.2em", marginBottom: 6 }}
                    >
                      Limited Launch Offer
                    </p>
                    <h2 className="text-white font-bold" style={{ fontSize: 22, lineHeight: 1.2 }}>
                      Get Your AI Palm Reading
                    </h2>
                    <p style={{ color: "#4A5568", fontSize: 13, marginTop: 4 }}>
                      Personalized report delivered via WhatsApp
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    disabled={step === "verifying"}
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    <X className="w-4 h-4" style={{ color: "#6B7280" }} />
                  </button>
                </div>

                {/* Price pill */}
                <div className="flex items-center gap-3 mt-4">
                  <div
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2"
                    style={{
                      background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(167,139,250,0.08))",
                      border: "1px solid rgba(139,92,246,0.3)",
                    }}
                  >
                    <span className="text-white font-bold" style={{ fontSize: 22 }}>
                      ₹5
                    </span>
                    <span style={{ color: "#A78BFA", fontSize: 13, fontWeight: 500 }}>
                      only
                    </span>
                  </div>
                  <div>
                    <p style={{ color: "#6B7280", fontSize: 12, textDecoration: "line-through" }}>
                      ₹299
                    </p>
                    <p style={{ color: "#34D399", fontSize: 12, fontWeight: 600 }}>
                      98% OFF — Today only
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-5">
                {step === "verifying" ? (
                  <div className="flex flex-col items-center gap-4 py-6">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}
                    >
                      <Loader2 className="w-7 h-7 animate-spin" style={{ color: "#8B5CF6" }} />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-semibold" style={{ fontSize: 16 }}>
                        Confirming payment...
                      </p>
                      <p style={{ color: "#6B7280", fontSize: 13, marginTop: 4 }}>
                        Please do not close this window
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                      <label style={{ color: "#9CA3AF", fontSize: 13, fontWeight: 500 }}>
                        Full Name <span style={{ color: "#F87171" }}>*</span>
                      </label>
                      <div className="relative">
                        <User
                          className="absolute"
                          style={{ left: 14, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "#4B5563" }}
                        />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          placeholder="Your name"
                          disabled={step === "creating"}
                          className="w-full text-white text-sm rounded-xl transition-colors outline-none"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            padding: "12px 14px 12px 38px",
                            fontSize: 14,
                          }}
                          onFocus={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.5)")}
                          onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                      <label style={{ color: "#9CA3AF", fontSize: 13, fontWeight: 500 }}>
                        Email <span style={{ color: "#F87171" }}>*</span>
                      </label>
                      <div className="relative">
                        <Mail
                          className="absolute"
                          style={{ left: 14, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "#4B5563" }}
                        />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="you@example.com"
                          disabled={step === "creating"}
                          className="w-full text-white text-sm rounded-xl transition-colors outline-none"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            padding: "12px 14px 12px 38px",
                            fontSize: 14,
                          }}
                          onFocus={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.5)")}
                          onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                        />
                      </div>
                    </div>

                    {/* Phone (optional) */}
                    <div className="flex flex-col gap-1.5">
                      <label style={{ color: "#9CA3AF", fontSize: 13, fontWeight: 500 }}>
                        Phone{" "}
                        <span style={{ color: "#4B5563", fontSize: 11 }}>(optional)</span>
                      </label>
                      <div className="relative">
                        <Phone
                          className="absolute"
                          style={{ left: 14, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "#4B5563" }}
                        />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          disabled={step === "creating"}
                          className="w-full text-white text-sm rounded-xl transition-colors outline-none"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            padding: "12px 14px 12px 38px",
                            fontSize: 14,
                          }}
                          onFocus={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.5)")}
                          onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                        />
                      </div>
                    </div>

                    {/* Error */}
                    {(step === "error" || error) && error && (
                      <div
                        className="flex items-start gap-3 rounded-xl p-3"
                        style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}
                      >
                        <AlertCircle className="flex-shrink-0 w-4 h-4 mt-0.5" style={{ color: "#F87171" }} />
                        <p style={{ color: "#F87171", fontSize: 13, lineHeight: 1.5 }}>{error}</p>
                      </div>
                    )}

                    {/* CTA */}
                    <motion.button
                      type="submit"
                      disabled={!name.trim() || !email.trim() || step === "creating"}
                      whileHover={
                        name.trim() && email.trim() && step !== "creating"
                          ? { scale: 1.02, boxShadow: "0 0 32px 6px rgba(139,92,246,0.35)" }
                          : {}
                      }
                      whileTap={{ scale: 0.97 }}
                      className="w-full rounded-full font-semibold text-white flex items-center justify-center gap-2 transition-opacity"
                      style={{
                        padding: "14px 24px",
                        fontSize: 15,
                        background:
                          !name.trim() || !email.trim()
                            ? "rgba(139,92,246,0.3)"
                            : "linear-gradient(135deg, #7C3AED 0%, #8B5CF6 55%, #A78BFA 100%)",
                        boxShadow:
                          name.trim() && email.trim()
                            ? "0 8px 28px rgba(124,58,237,0.35)"
                            : "none",
                        cursor: !name.trim() || !email.trim() ? "not-allowed" : "pointer",
                        marginTop: 4,
                      }}
                    >
                      {step === "creating" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Opening Payment...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          Pay ₹5 — Unlock Reading
                        </>
                      )}
                    </motion.button>

                    {/* Trust line */}
                    <div className="flex items-center justify-center gap-2" style={{ marginTop: -4 }}>
                      <ShieldCheck className="w-3.5 h-3.5" style={{ color: "#4B5563" }} />
                      <p style={{ color: "#4B5563", fontSize: 12 }}>
                        Secured by Razorpay · UPI, Cards, Net Banking
                      </p>
                    </div>
                  </form>
                )}
              </div>

              {/* What you get */}
              <div
                className="px-6 pb-6"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 16 }}
              >
                <p style={{ color: "#6B7280", fontSize: 12, marginBottom: 10 }}>
                  What you get:
                </p>
                <div className="flex flex-col gap-2">
                  {DELIVERABLES.map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <div
                        className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)" }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#A78BFA" }} />
                      </div>
                      <span style={{ color: "#9CA3AF", fontSize: 13 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const DELIVERABLES = [
  "Personality & character analysis",
  "Love & relationship insights",
  "Career & purpose guidance",
  "Health & energy reading",
  "Delivered on WhatsApp in 24 hours",
];
