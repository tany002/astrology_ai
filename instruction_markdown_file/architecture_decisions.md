# Architecture Decisions

## ADR-001

Reports are generated immediately after palm upload.

Reason

- Better UX
- Faster unlock
- Lower AI cost
- Easier retries

---

## ADR-002

No authentication for MVP.

Reason

Reduce friction.

---

## ADR-003

No User model.

Reason

Payment linked to reportId.

---

## ADR-004

AI uses two-step pipeline.

Vision

↓

Structured JSON

↓

LLM

Reason

Better consistency.

---

## ADR-005

Mobile-first architecture.

Reason

Traffic primarily from Instagram and Facebook ads.

---

## ADR-006

Date: 2026-07-27

Phase 1 frontend uses Next.js App Router with all interactive pages as Client Components.

Decision

Upload, Scan, and Preview pages use `"use client"` directive. Landing and Report pages are Server Components.

Reason

Framer Motion, react-dropzone, and stateful UI (upload progress, animation timers) require access to browser APIs.

Alternatives considered

Using Next.js Server Actions for form handling.

Tradeoff

Slightly larger JS bundle on interactive pages. Acceptable for MVP.

---

## ADR-007

Date: 2026-07-27

`reportId` is the sole session token passed via URL segments throughout the entire user flow.

Decision

No localStorage, no cookies, no auth tokens. The URL is the state. Example: `/scan/abc-123`, `/preview/abc-123`, `/report/abc-123`.

Reason

Eliminates session management complexity. Users can bookmark or share their report URL.

Tradeoff

Anyone with the reportId URL can view the report after payment. Acceptable for MVP given no sensitive PII beyond email and phone, which are not exposed in the report URL.

---

## ADR-008

Date: 2026-07-27

Scan animation runs for a minimum of 5 seconds regardless of AI response time.

Decision

The scan page enforces `MINIMUM_DISPLAY_MS = 5000`. After the animation completes, if the backend has not responded, the UI shows "Finalizing your reading..." and holds until the response arrives.

Reason

Documentation specifies 4–6 second animation, but AI pipeline takes 15–40 seconds. A minimum duration ensures the experience feels deliberate rather than broken.

Alternatives considered

Streaming progress signals via SSE from backend.

Tradeoff

Animation is cosmetic for Phase 1 (mock data). Phase 4 (AI integration) should consider SSE for genuine step-by-step feedback.

---

## ADR-009

Date: 2026-07-27

All user-facing strings live in `src/constants/copy.ts` as a single typed constant.

Decision

No inline strings in component JSX. All copy imported from `COPY.*`.

Reason

Enables future internationalisation, A/B testing of copy, and eliminates duplication. Consistent with documentation requirement for no hardcoded values.

Tradeoff

None significant at this scale.

---

## ADR-010

Date: 2026-07-27

Tailwind CSS 4 (CSS-based config) is used instead of the legacy `tailwind.config.ts` file.

Decision

Design tokens (colors, fonts) are defined in `globals.css` using `@theme inline {}`. No `tailwind.config.ts` file.

Reason

create-next-app with Tailwind 4 scaffolds this way by default. Tailwind 4 does not use a JS config file.

Tradeoff

Team members familiar only with Tailwind 3 need to learn the new CSS-based configuration syntax.