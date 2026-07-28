# astrologer.ai

> AI-powered Palm Reading Platform built as a premium consumer SaaS product.

---

# Project Overview

astrologer.ai enables users to upload a photo of their palm and receive a beautifully designed AI-generated palm reading report.

The product is designed primarily for users arriving from Meta (Instagram/Facebook) advertisements.

The objective is to create a fast, premium experience that converts curiosity into paid report purchases.

---

# MVP Goals

The MVP focuses on delivering one exceptional user journey.

Meta Ad
↓

Landing Page
↓

Upload Palm
↓

AI Analysis
↓

Preview Report
↓

Payment
↓

Unlock Full Report

No login.

No onboarding.

No unnecessary features.

Every interaction should reduce friction.

---

# Product Principles

The product should feel

- Premium
- Modern
- Trustworthy
- Minimal
- Fast
- Mobile-first

It should **not** resemble a traditional astrology website.

The experience should feel closer to products like Apple, Linear, Notion, or Raycast than conventional horoscope platforms.

---

# Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion

## Backend

- Node.js
- Express.js
- TypeScript

## Database

- MongoDB Atlas

## Image Storage

- Cloudinary

## AI

- OpenAI Vision
- OpenAI LLM

## Payments

- Razorpay

## Hosting

Frontend → Vercel

Backend → Northflank

---

# Documentation

Read every document **in order** before writing any code.

Each document builds upon the previous one.

If two documents appear to conflict, the document with the higher number takes precedence.

---

## 00_CURSOR_INSTRUCTIONS.md

Engineering philosophy and implementation workflow.

---

## 01_EXECUTIVE_SUMMARY.md

Business goals, vision, revenue model and project scope.

---

## 02_PRODUCT_VISION.md

Product philosophy, user problems, long-term direction and success metrics.

---

## 03_BRAND_GUIDELINES.md

Brand identity, tone, messaging, typography and visual direction.

---

## 04_UI_DESIGN_SYSTEM.md

Design system, colors, spacing, typography, components and animations.

---

## 05_USER_FLOW.md

Complete customer journey and interaction flow.

---

## 06_LANDING_PAGE.md

Landing page structure, content hierarchy and conversion strategy.

---

## 07_PALM_SCAN_AND_REPORT.md

Palm upload experience, scan flow, report preview and customer experience.

---

## 08_BACKEND_ARCHITECTURE.md

Backend architecture, services, folders and infrastructure.

---

## 09_DATABASE_AND_API.md

Database schema, API contracts and backend communication.

---

## 10_AI_ARCHITECTURE.md

AI pipeline, Vision analysis, report generation, retry logic and processing flow.

---

## 11_PROMPT_ENGINEERING.md

Prompt design, AI behavior, writing style, safety rules and output consistency.

---

## 12_AI_REPORT_SPECIFICATION.md

Complete report schema, rendering rules, preview generation and personalization.

---

## 13_DEPLOYMENT_AND_OPERATIONS.md

Deployment strategy, production environment, monitoring and operational guidelines.

---

# Implementation Strategy

Build the application in phases.

Never attempt to build everything at once.

---

## Phase 1

Frontend only.

Build

- Landing Page
- Upload Page
- Scanning Experience
- Preview Screen
- Full Report Screen

Use mock JSON.

No backend.

No AI.

No payments.

---

## Phase 2

Backend foundation.

Implement

- Express server
- MongoDB
- Folder structure
- API routes
- Validation
- Error handling

Use mock AI responses.

---

## Phase 3

Image pipeline.

Implement

- Cloudinary uploads
- Image validation
- Report persistence

---

## Phase 4

AI integration.

Implement

- Vision analysis
- Report generation
- Preview generation
- Prompt pipeline

---

## Phase 5

Payments.

Implement

- Razorpay
- Webhooks
- Report unlock flow

---

## Phase 6

Production readiness.

Implement

- Testing
- Performance optimization
- Deployment
- Bug fixes
- Final polish

---

# Engineering Principles

Always prefer

- Simplicity
- Readability
- Performance
- Maintainability
- Reusable components
- Strong typing

Avoid

- Duplicate code
- Premature optimization
- Unnecessary abstractions
- Hardcoded values
- Large components

---

# UX Principles

Every screen should communicate

- Trust
- Simplicity
- Premium quality

Animations should be purposeful.

Loading states should communicate progress.

Mobile experience takes priority over desktop.

---

# AI Principles

Generate the complete report immediately after upload.

Store the report before payment.

Payment should only unlock an existing report.

Never regenerate reports after successful payment.

---

# Development Workflow

Before every implementation phase

1. Explain what will be built.
2. List files to be created.
3. Highlight assumptions.
4. Wait for approval.

After every phase

1. Summarize completed work.
2. Show folder structure.
3. List created components.
4. List remaining work.
5. Suggest improvements.
6. Stop and wait for approval.

---

# Architecture Decisions

Whenever an engineering decision is made that is not explicitly covered by the documentation, record it in:

`ARCHITECTURE_DECISIONS.md`

Each decision should include:

- Decision
- Reason
- Alternatives considered
- Tradeoffs
- Date

This file becomes the project's engineering history.

---

# Success Criteria

The MVP is considered complete when:

- The user journey is smooth from landing page to payment.
- The UI feels premium and polished.
- Reports are generated consistently.
- Payments unlock reports instantly.
- Performance meets defined targets.
- The codebase is clean, maintainable and production-ready.

---

# Final Principle

This project is not about building the largest feature set.

It is about building the highest-quality first experience possible.

Every engineering decision should improve user trust, product quality and conversion.