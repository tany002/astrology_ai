"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Loader2, AlertCircle, X } from "lucide-react";
import { createSimpleOrder, verifySimplePayment, ApiError } from "@/lib/api";

type PayState = "idle" | "creating" | "open" | "verifying" | "error";

export default function HeroSection() {
  const router = useRouter();
  const [payState, setPayState] = useState<PayState>("idle");
  const [payError, setPayError] = useState<string | null>(null);

  const handleGetReading = useCallback(async () => {
    if (payState === "creating" || payState === "verifying") return;

    setPayState("creating");
    setPayError(null);

    try {
      const order = await createSimpleOrder({});

      if (!window.Razorpay) {
        throw new Error(
          "Payment gateway is still loading. Please wait a moment and try again."
        );
      }

      setPayState("open");

      const rzp = new window.Razorpay({
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "astrologer.ai",
        description: "AI Palm Reading — ₹5 Launch Offer",
        theme: { color: "#8B5CF6" },
        modal: {
          confirm_close: true,
          ondismiss: () => {
            setPayState("idle");
          },
        },
        handler: async (response: RazorpayPaymentResponse) => {
          setPayState("verifying");
          try {
            const verified = await verifySimplePayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            sessionStorage.setItem(
              "verifiedPayment",
              JSON.stringify({
                paymentId: verified.paymentId,
                orderId: verified.orderId,
                timestamp: Date.now(),
              })
            );

            router.push("/success");
          } catch {
            setPayState("error");
            setPayError(
              "Payment received but verification failed. Please contact support with your Payment ID: " +
                response.razorpay_payment_id
            );
          }
        },
      });

      rzp.open();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to start payment. Please try again.";
      setPayState("error");
      setPayError(message);
    }
  }, [payState, router]);

  const isLoading = payState === "creating" || payState === "verifying";
  const buttonLabel =
    payState === "creating"
      ? "Opening checkout..."
      : payState === "verifying"
      ? "Confirming payment..."
      : "Get My Reading for ₹5";

  return (
    <section
      className="relative w-full min-h-screen flex flex-col items-center px-6"
      style={{
        paddingTop: "clamp(64px, 9vh, 100px)",
        paddingBottom: "clamp(40px, 6vh, 72px)",
        background: "linear-gradient(180deg, #070A14 0%, #0B1020 52%, #101626 100%)",
      }}
    >
      {/* Headline block */}
      <motion.div
        className="flex flex-col items-center text-center w-full"
        style={{ maxWidth: 650 }}
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Eyebrow */}
        <motion.p
          className="font-semibold uppercase"
          style={{ color: "#A78BFA", fontSize: 11, letterSpacing: "0.22em", marginBottom: 20 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12, duration: 0.7 }}
        >
          AI Palm Reading
        </motion.p>

        {/* Headline */}
        <motion.h1
          className="font-bold text-white"
          style={{
            fontSize: "clamp(38px, 6.5vw, 66px)",
            lineHeight: 1.08,
            letterSpacing: "-0.025em",
            marginBottom: 20,
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
        >
          Your Palm Holds
          <br />
          <span
            style={{
              background: "linear-gradient(120deg, #C4B5FD 0%, #8B5CF6 45%, #A78BFA 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Every Answer
          </span>
        </motion.h1>

        {/* Sub-copy */}
        <motion.p
          style={{
            color: "#7B89A8",
            fontSize: "clamp(15px, 1.8vw, 17px)",
            lineHeight: 1.7,
            maxWidth: 460,
            marginBottom: 36,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.38, duration: 0.7 }}
        >
          AI-powered palm analysis that reveals hidden insights about your love, career, health and
          destiny.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="flex flex-col items-center"
          style={{ gap: 12 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.52, duration: 0.7 }}
        >
          <motion.button
            onClick={handleGetReading}
            disabled={isLoading}
            whileHover={
              !isLoading
                ? {
                    scale: 1.03,
                    boxShadow: "0 0 40px 10px rgba(139,92,246,0.36), 0 8px 28px rgba(0,0,0,0.45)",
                  }
                : {}
            }
            whileTap={!isLoading ? { scale: 0.97 } : {}}
            transition={{ duration: 0.18 }}
            className="inline-flex items-center cursor-pointer border-0 outline-none text-white font-semibold rounded-full"
            style={{
              gap: 10,
              padding: "14px 36px",
              fontSize: 15,
              letterSpacing: "0.025em",
              background: isLoading
                ? "rgba(124,58,237,0.6)"
                : "linear-gradient(135deg, #7C3AED 0%, #8B5CF6 55%, #A78BFA 100%)",
              boxShadow: isLoading ? "none" : "0 8px 28px rgba(124,58,237,0.32), 0 2px 8px rgba(0,0,0,0.3)",
              cursor: isLoading ? "not-allowed" : "pointer",
              minWidth: 240,
              justifyContent: "center",
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {buttonLabel}
              </>
            ) : (
              <>
                {buttonLabel}
                <span style={{ fontSize: 18, lineHeight: 1 }}>→</span>
              </>
            )}
          </motion.button>

          <p style={{ color: "#3A4258", fontSize: 12 }}>
            No account required · Report on WhatsApp within 24 hrs
          </p>
        </motion.div>

        {/* Error banner */}
        <AnimatePresence>
          {payState === "error" && payError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-start gap-3 rounded-2xl mt-4"
              style={{
                background: "rgba(248,113,113,0.08)",
                border: "1px solid rgba(248,113,113,0.2)",
                padding: "12px 14px",
                maxWidth: 420,
              }}
            >
              <AlertCircle className="flex-shrink-0 w-4 h-4 mt-0.5" style={{ color: "#F87171" }} />
              <p style={{ color: "#F87171", fontSize: 13, lineHeight: 1.5, flex: 1 }}>{payError}</p>
              <button
                onClick={() => { setPayState("idle"); setPayError(null); }}
                style={{ color: "#6B7280", flexShrink: 0 }}
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Palm image */}
      <motion.div
        className="relative flex items-center justify-center"
        style={{ marginTop: "clamp(24px, 4vh, 44px)", marginBottom: "clamp(16px, 3vh, 32px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75, duration: 1.2, ease: "easeOut" }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: "-60px -40px",
            background:
              "radial-gradient(ellipse 58% 44% at 50% 62%, rgba(109,40,217,0.30) 0%, rgba(139,92,246,0.10) 50%, transparent 72%)",
            pointerEvents: "none",
          }}
        />
        <motion.div
          animate={{ y: [0, -11, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          style={{ position: "relative" }}
        >
          <div style={{ position: "relative", display: "inline-block" }}>
            <Image
              src="/images/palm2.png"
              alt="AI palm reading — open palm with glowing lines"
              width={1024}
              height={1536}
              priority
              quality={92}
              style={{
                height: "clamp(310px, 43vh, 476px)",
                width: "auto",
                display: "block",
                filter:
                  "drop-shadow(0 0 32px rgba(109,40,217,0.20)) drop-shadow(0 28px 56px rgba(0,0,0,0.70))",
              }}
            />
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: 0, left: 0, right: 0,
                height: "36%",
                background:
                  "linear-gradient(to bottom, #0B1020 0%, #0B1020 64%, rgba(11,16,32,0.45) 82%, transparent 100%)",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />
            <div
              aria-hidden
              style={{
                position: "absolute",
                bottom: 0, left: 0, right: 0,
                height: "16%",
                background: "linear-gradient(to top, #101626 0%, transparent 100%)",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Trust row */}
      <motion.div
        className="flex flex-wrap items-center justify-center"
        style={{ gap: "8px 32px" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
      >
        {TRUST.map(({ icon, label }) => (
          <div key={label} className="flex items-center" style={{ gap: 7 }}>
            <span role="img" aria-label={label} style={{ fontSize: 13 }}>
              {icon}
            </span>
            <span style={{ color: "#46516A", fontSize: 12.5, fontWeight: 500, letterSpacing: "0.025em" }}>
              {label}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

const TRUST = [
  { icon: "✨", label: "AI Powered" },
  { icon: "🔒", label: "Private & Secure" },
  { icon: "⚡", label: "Results in 24 Hours" },
];
