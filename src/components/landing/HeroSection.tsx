"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// Hero section — full-screen, centered, image-first.
//
// palm2.png is 1024×1536 (2:3).  The image contains its own headline text in
// the top ~26 % of its height.  We suppress that text with a gradient overlay
// that transitions from the page background colour to transparent, so the in-
// image text disappears and the hand merges seamlessly with the page.
// ─────────────────────────────────────────────────────────────────────────────
export default function HeroSection() {
  return (
    <section
      className="relative w-full min-h-screen flex flex-col items-center px-6"
      style={{
        paddingTop:    "clamp(64px, 9vh, 100px)",
        paddingBottom: "clamp(40px, 6vh, 72px)",
        // Background precisely matches the navy inside palm2.png so the image
        // edges are invisible.
        background:
          "linear-gradient(180deg, #070A14 0%, #0B1020 52%, #101626 100%)",
      }}
    >
      {/* ── Headline block ──────────────────────────────────────────── */}
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
          style={{
            color:         "#A78BFA",
            fontSize:      11,
            letterSpacing: "0.22em",
            marginBottom:  20,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12, duration: 0.7 }}
        >
          AI Palm Reading
        </motion.p>

        {/* Main headline */}
        <motion.h1
          className="font-bold text-white"
          style={{
            fontSize:      "clamp(38px, 6.5vw, 66px)",
            lineHeight:    1.08,
            letterSpacing: "-0.025em",
            marginBottom:  20,
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
        >
          Your Palm Holds
          <br />
          <span
            style={{
              background:
                "linear-gradient(120deg, #C4B5FD 0%, #8B5CF6 45%, #A78BFA 100%)",
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
            color:        "#7B89A8",
            fontSize:     "clamp(15px, 1.8vw, 17px)",
            lineHeight:   1.7,
            maxWidth:     460,
            marginBottom: 36,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.38, duration: 0.7 }}
        >
          AI-powered palm analysis that reveals hidden insights about your love,
          career, health and destiny.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="flex flex-col items-center"
          style={{ gap: 12 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.52, duration: 0.7 }}
        >
          <Link href="/upload" style={{ textDecoration: "none" }}>
            <motion.button
              whileHover={{
                scale:     1.03,
                boxShadow: "0 0 40px 10px rgba(139,92,246,0.36), 0 8px 28px rgba(0,0,0,0.45)",
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="inline-flex items-center cursor-pointer border-0 outline-none text-white font-semibold rounded-full"
              style={{
                gap:           10,
                padding:       "14px 36px",
                fontSize:      15,
                letterSpacing: "0.025em",
                background:    "linear-gradient(135deg, #7C3AED 0%, #8B5CF6 55%, #A78BFA 100%)",
                boxShadow:     "0 8px 28px rgba(124,58,237,0.32), 0 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              Scan My Palm
              <span style={{ fontSize: 18, lineHeight: 1 }}>→</span>
            </motion.button>
          </Link>

          <p style={{ color: "#3A4258", fontSize: 12 }}>
            No account required · ₹5 to unlock full report
          </p>
        </motion.div>
      </motion.div>

      {/* ── Palm image ───────────────────────────────────────────────── */}
      <motion.div
        className="relative flex items-center justify-center"
        style={{ marginTop: "clamp(24px, 4vh, 44px)", marginBottom: "clamp(16px, 3vh, 32px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75, duration: 1.2, ease: "easeOut" }}
      >
        {/* Deep aura behind the hand (centred on the palm area, lower half) */}
        <div
          aria-hidden
          style={{
            position:    "absolute",
            inset:       "-60px -40px",
            background:  "radial-gradient(ellipse 58% 44% at 50% 62%, rgba(109,40,217,0.30) 0%, rgba(139,92,246,0.10) 50%, transparent 72%)",
            pointerEvents: "none",
          }}
        />

        {/* Floating wrapper */}
        <motion.div
          animate={{ y: [0, -11, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          style={{ position: "relative" }}
        >
          {/*
           * Inner wrapper keeps the absolute overlays aligned to the image,
           * even while the parent floats.
           */}
          <div style={{ position: "relative", display: "inline-block" }}>
            <Image
              src="/images/palm2.png"
              alt="AI palm reading — open palm with glowing lines"
              width={1024}
              height={1536}
              priority
              quality={92}
              style={{
                // Constrain display size — portrait image
                height: "clamp(310px, 43vh, 476px)",
                width:  "auto",
                display: "block",
                // Subtle outer glow (rectangular, follows image bounds)
                filter:
                  "drop-shadow(0 0 32px rgba(109,40,217,0.20)) drop-shadow(0 28px 56px rgba(0,0,0,0.70))",
              }}
            />

            {/*
             * TOP OVERLAY — suppresses the headline text that's baked into
             * the image.  The same colour as the page background fades the
             * top ~26 % of the image to nothing; the transition to transparent
             * is short so the hand and fingers appear fully immediately after.
             *
             * Why overlay, not CSS mask: overlays are additive on top of the
             * image whereas masks punch through it — overlays interact better
             * with filter:drop-shadow.
             */}
            <div
              aria-hidden
              style={{
                position:   "absolute",
                top:        0,
                left:       0,
                right:      0,
                height:     "36%",
                background: "linear-gradient(to bottom, #0B1020 0%, #0B1020 64%, rgba(11,16,32,0.45) 82%, transparent 100%)",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />

            {/*
             * BOTTOM OVERLAY — fades the bottom edge of the image into the
             * page background so there's no hard rectangular cut-off.
             */}
            <div
              aria-hidden
              style={{
                position:   "absolute",
                bottom:     0,
                left:       0,
                right:      0,
                height:     "16%",
                background: "linear-gradient(to top, #101626 0%, transparent 100%)",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* ── Trust row ───────────────────────────────────────────────── */}
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
            <span
              style={{
                color:         "#46516A",
                fontSize:      12.5,
                fontWeight:    500,
                letterSpacing: "0.025em",
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

const TRUST = [
  { icon: "✨", label: "AI Powered"            },
  { icon: "🔒", label: "Private & Secure"       },
  { icon: "⚡", label: "Results in 60 Seconds"  },
];
