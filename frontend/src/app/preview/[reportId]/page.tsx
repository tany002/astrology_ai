"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, AlertCircle, X, Loader2, Mail, Phone } from "lucide-react";
import { COPY } from "@/constants/copy";
import { fetchReport, createPaymentOrder, verifyPayment, ApiError } from "@/lib/api";
import type { ReportPreview } from "@/types/report";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

type PageState = "loading" | "ready" | "error";
type PaymentState = "idle" | "collecting" | "creating" | "open" | "verifying" | "failed";


export default function PreviewPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.reportId as string;

  const [pageState, setPageState] = useState<PageState>("loading");
  const [preview, setPreview] = useState<ReportPreview | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!reportId) {
      router.replace("/upload");
      return;
    }

    fetchReport(reportId)
      .then((data) => {
        if (data.paymentStatus === "paid") {
          router.replace(`/report/${reportId}`);
          return;
        }
        setPreview(data.preview ?? null);
        setPageState("ready");
      })
      .catch((err) => {
        const message =
          err instanceof ApiError ? err.message : "Failed to load your report. Please try again.";
        setLoadError(message);
        setPageState("error");
      });
  }, [reportId, router]);

  const handleUnlock = () => {
    setPaymentState("collecting");
    setPaymentError(null);
  };

  const handlePaymentSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim()) return;

      setPaymentState("creating");
      setPaymentError(null);

      try {
        const order = await createPaymentOrder(reportId, email.trim(), phone.trim() || undefined);

        if (!window.Razorpay) {
          throw new Error("Payment gateway not loaded. Please refresh and try again.");
        }

        setPaymentState("open");

        const rzp = new window.Razorpay({
          key: order.key,
          amount: order.amount,
          currency: order.currency,
          order_id: order.orderId,
          name: "astrologer.ai",
          description: "Full Palm Reading Report",
          prefill: { email: email.trim(), contact: phone.trim() || undefined },
          theme: { color: "#D4AF37" },
          handler: async (response: RazorpayPaymentResponse) => {
            setPaymentState("verifying");
            try {
              await verifyPayment({
                reportId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              router.push(`/report/${reportId}`);
            } catch {
              setPaymentState("failed");
              setPaymentError(
                "Payment verification failed. If your payment was deducted, please contact support."
              );
            }
          },
          modal: {
            ondismiss: () => {
              setPaymentState((prev) => (prev === "open" ? "idle" : prev));
            },
          },
        });

        rzp.open();
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : "Failed to initiate payment. Please try again.";
        setPaymentState("failed");
        setPaymentError(message);
      }
    },
    [email, phone, reportId, router]
  );

  if (pageState === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin" />
          <p className="text-[#A5A8C3] text-sm">Loading your reading...</p>
        </div>
      </main>
    );
  }

  if (pageState === "error") {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-[400px] text-center flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-[#FF6B6B]" />
          </div>
          <div>
            <h2 className="text-white text-xl font-bold mb-2">Could Not Load Report</h2>
            <p className="text-[#A5A8C3] text-base">{loadError}</p>
          </div>
          <Button onClick={() => router.push("/upload")}>Try Again</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-28">
      <div className="max-w-[720px] mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[#D4AF37] text-sm font-medium tracking-widest uppercase mb-2">
            Your Reading is Ready
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            {COPY.preview.heading}
          </h1>
          <p className="text-[#A5A8C3] text-base">{COPY.preview.subheading}</p>
        </motion.div>

        {/* Preview cards */}
        <div className="flex flex-col gap-5 mb-8">
          {/* Personality — fully visible */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <p className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase mb-3">
                {COPY.report.sectionTitles.personality}
              </p>
              <p className="text-white text-base leading-[1.75]">
                {preview?.personality ?? ""}
              </p>
            </Card>
          </motion.div>

          {/* Love — first paragraph with blur fade */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="overflow-hidden">
              <p className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase mb-3">
                {COPY.report.sectionTitles.love}
              </p>
              <div className="relative">
                <p className="text-white text-base leading-[1.75]">{preview?.love ?? ""}</p>
                <div
                  className="absolute bottom-0 left-0 right-0 h-12"
                  style={{ background: "linear-gradient(to bottom, transparent, #171C33)" }}
                />
              </div>
            </Card>
          </motion.div>

          {/* Locked sections */}
          <BlurredCard title={COPY.report.sectionTitles.career} delay={0.3} />
          <BlurredCard title={COPY.report.sectionTitles.health} delay={0.4} />
          <BlurredCard title={COPY.report.sectionTitles.strengths} delay={0.5} />
        </div>

        {/* Sticky CTA */}
        <motion.div
          className="sticky bottom-6 z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <div className="bg-[#090B16]/80 backdrop-blur-md border border-[#2D355A] rounded-[24px] p-5 flex flex-col sm:flex-row items-center gap-4 shadow-2xl">
            <div className="flex-1 text-center sm:text-left">
              <p className="text-white font-semibold text-base">{COPY.preview.unlockCta}</p>
              <p className="text-[#D4AF37] text-sm font-medium mt-0.5">{COPY.preview.price}</p>
            </div>
            {paymentState === "verifying" ? (
              <div className="flex items-center gap-2 text-[#D4AF37] text-sm font-medium">
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying payment...
              </div>
            ) : (
              <Button
                fullWidth
                className="sm:w-auto whitespace-nowrap"
                onClick={handleUnlock}
                disabled={
                  paymentState === "creating" ||
                  paymentState === "open" ||
                  paymentState === "collecting"
                }
              >
                Unlock Now
              </Button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Payment contact modal */}
      <AnimatePresence>
        {(paymentState === "collecting" || paymentState === "creating") && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setPaymentState("idle")}
            />
            <motion.div
              className="relative w-full max-w-[420px] bg-[#11152A] border border-[#2D355A] rounded-[24px] p-6 z-10"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setPaymentState("idle")}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-[#A5A8C3]" />
              </button>

              <h3 className="text-white text-xl font-bold mb-1">Unlock Full Report</h3>
              <p className="text-[#A5A8C3] text-sm mb-6">
                Enter your email to receive your reading confirmation.
              </p>

              <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#A5A8C3] text-sm font-medium">
                    Email <span className="text-[#FF6B6B]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A5A8C3]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="w-full bg-[#0D1024] border border-[#2D355A] rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-[#4A4E6A] focus:outline-none focus:border-[#D4AF37]/60 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[#A5A8C3] text-sm font-medium">
                    Phone <span className="text-[#4A4E6A] text-xs">(optional)</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A5A8C3]" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#0D1024] border border-[#2D355A] rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-[#4A4E6A] focus:outline-none focus:border-[#D4AF37]/60 transition-colors"
                    />
                  </div>
                </div>

                {paymentError && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/20">
                    <AlertCircle className="w-4 h-4 text-[#FF6B6B] flex-shrink-0 mt-0.5" />
                    <p className="text-[#FF6B6B] text-sm">{paymentError}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  fullWidth
                  loading={paymentState === "creating"}
                  disabled={!email.trim() || paymentState === "creating"}
                  className="mt-2"
                >
                  Pay ₹299 — Unlock Now
                </Button>

                <p className="text-[#4A4E6A] text-xs text-center">
                  Secured by Razorpay · 256-bit encryption
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment failure state */}
      <AnimatePresence>
        {paymentState === "failed" && paymentError && (
          <motion.div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full px-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
          >
            <div className="bg-[#11152A] border border-[#FF6B6B]/30 rounded-2xl p-4 flex items-start gap-3 shadow-2xl">
              <AlertCircle className="w-5 h-5 text-[#FF6B6B] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-white text-sm font-medium mb-1">Payment Failed</p>
                <p className="text-[#A5A8C3] text-xs">{paymentError}</p>
              </div>
              <button
                onClick={() => {
                  setPaymentState("idle");
                  setPaymentError(null);
                }}
                className="text-[#A5A8C3] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function BlurredCard({ title, delay }: { title: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="relative overflow-hidden">
        <p className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase mb-3">
          {title}
        </p>
        <div className="flex flex-col gap-2 relative">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-4 rounded-full bg-white/10 animate-shimmer"
              style={{ width: i === 2 ? "65%" : "100%" }}
            />
          ))}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2"
            style={{
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              background: "rgba(23,28,51,0.3)",
              borderRadius: 12,
            }}
          >
            <Lock className="w-4 h-4 text-[#A5A8C3]" />
            <span className="text-[#A5A8C3] text-xs">{COPY.preview.blurLabel}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
