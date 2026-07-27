"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { COPY } from "@/constants/copy";
import { MOCK_REPORT_ID } from "@/lib/mockData";

const STEP_DURATIONS = [700, 1000, 900, 1000, 900, 800, 800]; // ms per step
const MINIMUM_DISPLAY_MS = 5000; // always show at least 5s

export default function ScanAnimation() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [scanPosition, setScanPosition] = useState(0); // 0–100 %
  const [done, setDone] = useState(false);
  const startTime = useRef(Date.now());

  // Advance steps on a timer
  useEffect(() => {
    let stepIndex = 0;

    const advance = () => {
      if (stepIndex >= COPY.scan.steps.length - 1) {
        // All steps done — enforce minimum display time then navigate
        const elapsed = Date.now() - startTime.current;
        const remaining = Math.max(0, MINIMUM_DISPLAY_MS - elapsed);
        setTimeout(() => {
          setDone(true);
          setTimeout(() => router.push(`/preview/${MOCK_REPORT_ID}`), 600);
        }, remaining);
        return;
      }

      const delay = STEP_DURATIONS[stepIndex] ?? 800;
      setTimeout(() => {
        setCompletedSteps((prev) => [...prev, stepIndex]);
        stepIndex += 1;
        setCurrentStep(stepIndex);
        advance();
      }, delay);
    };

    advance();
  }, [router]);

  // Scan beam animation — moves 0→100 over 5 seconds
  useEffect(() => {
    const total = MINIMUM_DISPLAY_MS;
    const interval = 30;
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += interval;
      setScanPosition(Math.min(100, (elapsed / total) * 100));
      if (elapsed >= total) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-[420px] mx-auto flex flex-col items-center gap-10">
      {/* Palm with scan beam */}
      <div className="relative w-[240px] h-[290px]">
        {/* Glow */}
        <div
          className="absolute inset-0 pointer-events-none rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)",
          }}
        />

        {/* Palm illustration — inline SVG for scan consistency */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ScanPalm />
        </motion.div>

        {/* Scanning beam */}
        <motion.div
          className="absolute left-0 right-0 h-[2px] pointer-events-none"
          style={{
            top: `${scanPosition}%`,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.8) 20%, rgba(212,175,55,1) 50%, rgba(212,175,55,0.8) 80%, transparent 100%)",
            boxShadow: "0 0 12px 2px rgba(212,175,55,0.5)",
            opacity: scanPosition >= 95 ? 0 : 1,
          }}
        />
      </div>

      {/* Steps list */}
      <div className="w-full flex flex-col gap-3">
        {COPY.scan.steps.map((step, i) => {
          const isCompleted = completedSteps.includes(i);
          const isActive = currentStep === i && !done;
          const isVisible = i <= currentStep;

          return (
            <AnimatePresence key={step}>
              {isVisible && (
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3"
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-[#35D07F]" />
                    ) : isActive ? (
                      <motion.div
                        className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                      />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-[#2D355A]" />
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={
                      isCompleted
                        ? "text-[#A5A8C3] text-sm"
                        : isActive
                        ? "text-white text-sm font-medium"
                        : "text-[#2D355A] text-sm"
                    }
                  >
                    {step}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          );
        })}
      </div>

      {/* Holding state */}
      <AnimatePresence>
        {currentStep >= COPY.scan.steps.length - 1 && !done && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.6, 1] }}
            className="text-[#D4AF37] text-sm font-medium text-center"
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Finalizing your reading...
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Simple palm SVG for scan background ─────────────────────────────────────
function ScanPalm() {
  const OUTLINE = "M 76 385 C 54 382 44 365 44 344 L 46 268 C 46 254 49 242 54 230 C 54 212 57 196 60 181 C 60 164 65 151 76 147 C 87 143 101 145 107 155 C 113 165 113 180 111 196 L 108 222 C 111 212 117 206 124 207 L 125 169 C 125 151 132 138 145 135 C 158 132 171 137 176 148 C 181 159 180 177 177 193 L 173 223 C 176 213 182 207 190 208 L 191 162 C 191 144 199 130 213 128 C 227 126 239 133 243 147 C 247 161 244 179 240 195 L 234 225 C 238 215 246 209 254 212 L 256 175 C 257 157 265 143 277 140 C 289 137 299 146 301 160 C 303 174 299 193 291 207 L 277 237 C 268 255 254 267 240 277 C 250 287 272 287 276 277 L 283 255 C 290 237 294 219 289 205 C 284 191 273 185 262 189 C 251 193 245 207 243 223 L 238 251 C 235 271 233 293 234 315 C 235 343 232 367 228 381 C 226 397 198 405 146 403 C 106 403 86 397 76 385 Z";

  const lines = [
    { d: "M 74 232 C 100 222 135 218 165 216 C 195 214 222 220 244 229", color: "#F87171" },
    { d: "M 72 270 C 100 264 140 260 175 262 C 205 264 228 272 244 283", color: "#60A5FA" },
    { d: "M 238 196 C 218 208 203 228 193 253 C 183 278 180 306 183 336 C 185 358 190 376 196 392", color: "#34D399" },
    { d: "M 153 388 C 150 358 148 328 146 298 C 144 270 143 243 144 218 C 145 193 148 173 152 156", color: "#C084FC" },
  ];

  return (
    <svg
      viewBox="0 0 300 420"
      width={200}
      height={280}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <filter id="scan-line-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="scan-aura" cx="50%" cy="52%" r="48%">
          <stop offset="0%"   stopColor="#6E5BFF" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#090B16" stopOpacity="0"   />
        </radialGradient>
      </defs>
      <ellipse cx={150} cy={228} rx={148} ry={190} fill="url(#scan-aura)" />
      <path
        d={OUTLINE}
        stroke="rgba(255,255,255,0.70)"
        strokeWidth="1.4"
        fill="rgba(255,255,255,0.015)"
        strokeLinejoin="round"
      />
      {lines.map((l, i) => (
        <path
          key={i}
          d={l.d}
          stroke={l.color}
          strokeWidth="1.4"
          strokeLinecap="round"
          filter="url(#scan-line-glow)"
        />
      ))}
    </svg>
  );
}
