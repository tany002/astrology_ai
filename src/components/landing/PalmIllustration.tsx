"use client";

import { motion } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// HAND OUTLINE  — ViewBox 0 0 280 385
// Right hand, palmar view. Fingers point upward.
// Finger order L→R: pinky (x≈72), ring (x≈134), middle (x≈200), index (x≈258).
// Height hierarchy: middle (y≈80) > index (y≈88) > ring (y≈108) > pinky (y≈120).
// Natural inter-finger webs, realistic wrist taper, proportioned thumb.
// ─────────────────────────────────────────────────────────────────────────────
const HAND = `
  M 60 358
  C 44 352 36 336 36 314
  L 38 242
  C 38 226 42 214 48 206
  C 48 190 50 175 52 160
  C 52 143 55 131 64 125
  C 69 121 75 118 79 121
  C 83 124 87 134 89 148
  C 91 158 90 170 88 185
  L 86 198
  C 88 188 93 183 101 183
  L 102 148
  C 102 130 108 117 120 112
  C 131 108 143 110 148 123
  C 153 136 151 155 148 170
  L 145 190
  C 148 180 155 174 163 174
  L 164 124
  C 164 104 172 90 185 85
  C 198 80 211 83 215 97
  C 219 111 216 132 212 148
  L 208 170
  C 211 160 219 154 227 155
  L 228 118
  C 228 102 234 92 244 90
  C 256 88 268 94 271 109
  C 274 124 270 145 264 161
  L 255 181
  C 247 197 235 210 223 220
  C 231 229 251 229 253 219
  L 259 196
  C 264 181 266 166 260 155
  C 254 144 241 140 232 146
  C 223 152 217 166 215 181
  L 212 205
  C 209 223 207 245 208 267
  C 209 293 208 319 206 339
  C 204 357 199 367 218 368
  C 190 376 150 378 100 374
  C 76 370 64 366 60 358
  Z
`;

// ─────────────────────────────────────────────────────────────────────────────
// PALMISTRY LINES  — organic bezier curves inside the palm
// Coordinates recalibrated for the new hand path.
// ─────────────────────────────────────────────────────────────────────────────
const LINES = [
  {
    id: "heart",
    // Heart line — sweeps across upper palm just below the knuckle webs
    d: "M 50 238 C 82 228 118 224 152 222 C 180 220 200 224 213 232",
    color: "#F87171",
    opacity: 0.90,
    width: 1.5,
    delay: 2.2,
  },
  {
    id: "head",
    // Head line — below heart line, slight descent toward pinky side
    d: "M 213 272 C 184 266 150 262 120 264 C 92 266 66 274 46 284",
    color: "#60A5FA",
    opacity: 0.88,
    width: 1.4,
    delay: 2.7,
  },
  {
    id: "life",
    // Life line — from upper-right palm, sweeps left toward wrist
    d: "M 213 220 C 192 238 172 265 158 298 C 147 326 145 348 152 368",
    color: "#34D399",
    opacity: 0.85,
    width: 1.4,
    delay: 3.2,
  },
  {
    id: "fate",
    // Fate line — vertical, centre palm, wrist to middle-finger base
    d: "M 128 364 C 126 326 132 292 138 266 C 143 242 142 216 140 196",
    color: "#C084FC",
    opacity: 0.82,
    width: 1.2,
    delay: 3.7,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// AI INSIGHT LABELS
// All positioned in SVG coordinates (some outside the 0–280 viewBox).
// overflow:visible on the SVG lets them render. The parent wrapper has
// matching padding so they are never physically clipped by a container edge.
//
// Design: two mirrored columns flanking the hand — no connector lines,
// only a 3px colour dot to link the pill to its corresponding palm region.
// ─────────────────────────────────────────────────────────────────────────────
interface Label {
  id: string;
  text: string;
  /** pill centre in SVG units */
  cx: number;
  cy: number;
  color: string;
  /** which side the pill hangs on — affects text/dot alignment */
  side: "left" | "right" | "bottom";
  delay: number;
}

const LABELS: Label[] = [
  // ── left column ──────────────────────────────────────────────────
  { id: "children",  text: "Children",  cx: -20, cy: 202, color: "#FCD34D", side: "left",   delay: 4.0 },
  { id: "love",      text: "Love",      cx: -20, cy: 234, color: "#F87171", side: "left",   delay: 3.8 },
  { id: "marriage",  text: "Marriage",  cx: -20, cy: 266, color: "#FBBF24", side: "left",   delay: 4.2 },
  { id: "health",    text: "Health",    cx: -20, cy: 300, color: "#F472B6", side: "left",   delay: 4.4 },
  // ── right column ─────────────────────────────────────────────────
  { id: "success",   text: "Success",   cx: 300, cy: 198, color: "#A78BFA", side: "right",  delay: 3.9 },
  { id: "career",    text: "Career",    cx: 300, cy: 232, color: "#60A5FA", side: "right",  delay: 4.1 },
  { id: "money",     text: "Money",     cx: 300, cy: 266, color: "#34D399", side: "right",  delay: 4.3 },
  // ── bottom ───────────────────────────────────────────────────────
  { id: "big_change", text: "Big Change", cx: 120, cy: 408, color: "#C084FC", side: "bottom", delay: 4.5 },
];

// ─────────────────────────────────────────────────────────────────────────────
// PILL GEOMETRY  (all in SVG units)
// ─────────────────────────────────────────────────────────────────────────────
const PH = 22; // pill height
const PDOT_R = 2.8; // colour dot radius
const PDOT_OFFSET_X = 9; // dot offset from pill left edge
const PTEXT_OFFSET_X = 18; // text offset from pill left edge

function pillWidth(text: string): number {
  // Roughly calibrated for fontSize 10 with letter-spacing 0.3
  return Math.round(text.length * 7 + 26);
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// Wrapper padding keeps labels visible at any scale (overflow:visible on SVG).
// Left labels extend ~80 SVG units to the left; right labels extend ~70 right.
// At displayWidth 220px (scale=220/280=0.786): left=63px, right=55px → padded 70 each.
// ─────────────────────────────────────────────────────────────────────────────
export default function PalmIllustration() {
  return (
    <div
      className="relative select-none mx-auto w-full"
      style={{ maxWidth: 360, padding: "0 70px 32px" }}
    >
      <svg
        viewBox="0 0 280 385"
        width="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible", display: "block" }}
        aria-label="AI palm reading illustration"
        role="img"
      >
        <defs>
          {/* Soft bloom for palm lines */}
          <filter id="ph2-bloom" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Larger softer bloom for the hand outline */}
          <filter id="ph2-outline-glow" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Radial gradient for the ambient aura behind the palm */}
          <radialGradient id="ph2-aura" cx="46%" cy="54%" r="48%">
            <stop offset="0%"   stopColor="#6E5BFF" stopOpacity="0.20" />
            <stop offset="42%"  stopColor="#4A3AFF" stopOpacity="0.08" />
            <stop offset="78%"  stopColor="#D4AF37" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#090B16" stopOpacity="0"   />
          </radialGradient>

          {/* Radial for palm fill — very subtle skin-like warmth */}
          <radialGradient id="ph2-fill" cx="45%" cy="48%" r="55%">
            <stop offset="0%"   stopColor="rgba(255,250,240,0.042)" />
            <stop offset="100%" stopColor="rgba(255,250,240,0)"     />
          </radialGradient>
        </defs>

        {/* ── Ambient aura ────────────────────────────────────────────── */}
        <motion.ellipse
          cx={138} cy={228} rx={148} ry={192}
          fill="url(#ph2-aura)"
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        />

        {/* ── Palm outline — ghost glow pass (blurred duplicate) ───────── */}
        <motion.path
          d={HAND}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="6"
          fill="none"
          filter="url(#ph2-outline-glow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8 }}
        />

        {/* ── Palm outline — crisp stroke ──────────────────────────────── */}
        <motion.path
          d={HAND}
          stroke="rgba(255,255,255,0.76)"
          strokeWidth="1.2"
          fill="url(#ph2-fill)"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.8, ease: [0.25, 0.1, 0.25, 1] }}
        />

        {/* ── Palmistry lines ──────────────────────────────────────────── */}
        {LINES.map((line) => (
          <motion.path
            key={line.id}
            d={line.d}
            stroke={line.color}
            strokeWidth={line.width}
            strokeLinecap="round"
            opacity={line.opacity}
            filter="url(#ph2-bloom)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: line.opacity }}
            transition={{ duration: 1.4, delay: line.delay, ease: "easeInOut" }}
          />
        ))}

        {/* ── AI insight labels ─────────────────────────────────────────── */}
        {LABELS.map((label) => {
          const pw = pillWidth(label.text);
          const px = label.cx;
          const py = label.cy;
          const lx = px - pw / 2; // pill left edge
          const ty = py - PH / 2; // pill top edge

          return (
            <motion.g
              key={label.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: label.delay, duration: 0.6, ease: "easeOut" }}
            >
              {/* ── Pill ── */}
              {/* Outer border */}
              <rect
                x={lx} y={ty}
                width={pw} height={PH}
                rx={PH / 2}
                fill="rgba(8,10,24,0.86)"
                stroke="rgba(255,255,255,0.09)"
                strokeWidth="0.75"
              />
              {/* Inner specular line — gives the "top-lit glass" feeling */}
              <rect
                x={lx + 1} y={ty + 1}
                width={pw - 2} height={3}
                rx={1.5}
                fill="rgba(255,255,255,0.06)"
              />
              {/* Subtle colour tint wash inside the pill */}
              <rect
                x={lx + 1} y={ty + 1}
                width={pw - 2} height={PH - 2}
                rx={PH / 2 - 1}
                fill={label.color}
                fillOpacity="0.04"
              />
              {/* Colour indicator dot */}
              <circle
                cx={lx + PDOT_OFFSET_X}
                cy={py}
                r={PDOT_R}
                fill={label.color}
                opacity={0.88}
              />
              {/* Label text */}
              <text
                x={lx + PTEXT_OFFSET_X}
                y={py + 3.8}
                fill="rgba(255,255,255,0.80)"
                fontSize="9.5"
                fontFamily="-apple-system, BlinkMacSystemFont, 'Inter', system-ui, sans-serif"
                fontWeight="500"
                letterSpacing="0.35"
              >
                {label.text}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
