# 08_BACKEND_ARCHITECTURE.md

# astrologer.ai
## Backend Architecture

Version: 1.0

---

# Objective

Build a lightweight, scalable backend that powers the AI Palm Reading MVP.

The architecture should prioritize:

• Simplicity
• Low cost
• Fast development
• Easy deployment
• Easy debugging

Do NOT over-engineer the MVP.

---

# Tech Stack

Frontend

• Next.js 15
• React
• TypeScript
• Tailwind CSS

Backend

• Node.js
• Express.js
• TypeScript

Hosting

• Northflank

Database

• MongoDB Atlas

Storage

Option 1 (Recommended)

Cloudinary

Reason

- Free tier
- Image optimization
- Easy CDN
- Simple API

Alternative

AWS S3

(Not required for MVP)

Payments

Razorpay

AI

OpenAI GPT-4.1 (or latest available)
+
Vision-capable model for palm image analysis

---

# High-Level Architecture

                Meta Ad
                    │
                    ▼
             Next.js Frontend
                    │
                    ▼
             Express Backend
            (Northflank)
                    │
      ┌─────────────┼─────────────┐
      │             │             │
      ▼             ▼             ▼
 MongoDB      Cloudinary     OpenAI APIs
      │                           │
      └─────────────┬─────────────┘
                    ▼
              Razorpay Webhook

---

# Backend Responsibilities

The backend should handle:

✓ Image upload

✓ Image validation

✓ AI analysis

✓ Report generation

✓ Razorpay order creation

✓ Payment verification

✓ Saving reports

✓ Returning reports

Nothing else.

---

# Recommended Folder Structure

backend/

src/

config/

controllers/

middleware/

models/

routes/

services/

utils/

prompts/

types/

app.ts

server.ts

.env

---

# Folder Responsibilities

config/

MongoDB

Cloudinary

OpenAI

Razorpay

Environment config

---

controllers/

Receive API requests.

Return responses.

Business logic should NOT live here.

---

services/

Main application logic.

Examples

PalmAnalysisService

PaymentService

ReportService

UploadService

---

routes/

Express routes only.

Keep routes very small.

Example

POST /upload-palm

↓

UploadController

↓

UploadService

---

models/

MongoDB Schemas

Report

Payment

---

middleware/

Error Handler

Validation

Logger

Rate Limiter (Future)

---

prompts/

Store AI prompts separately.

Never hardcode prompts inside services.

Example

reportPrompt.ts

visionPrompt.ts

summaryPrompt.ts

---

utils/

Image helpers

Response helpers

Date helpers

Logger

---

# Request Flow

User uploads image

↓

Frontend sends image

↓

Backend validates image

↓

Image uploaded to Cloudinary

↓

Cloudinary URL stored

↓

Vision model analyzes palm

↓

Structured JSON created

↓

LLM generates report

↓

MongoDB stores report

↓

Preview returned

↓

User pays

↓

Webhook verifies payment

↓

Full report unlocked

---

# AI Pipeline

Stage 1

Vision Model

Input

Palm image

Output

Structured JSON

Example

{
  "hand":"right",
  "confidence":0.91,
  "imageQuality":"good",
  "majorLines":{
    "heartLine":{ "length":"long", "depth":"deep", "curve":"curved" },
    "lifeLine":{ "length":"long", "depth":"deep", "curve":"moderate" },
    "headLine":{ "length":"medium", "depth":"clear", "curve":"straight" },
    "fateLine":{ "visibility":"moderate" }
  },
  "mounts":{
    "venus":"prominent",
    "jupiter":"average",
    "saturn":"strong",
    "apollo":"moderate",
    "mercury":"average"
  },
  "overallObservation":"Clear palm with strong major lines."
}

↓

Stage 2

LLM

Input

Structured JSON

↓

Beautiful report

↓

Save to database

Never send raw vision output to frontend.

---

# Environment Variables

PORT

MONGODB_URI

OPENAI_API_KEY

CLOUDINARY_CLOUD_NAME

CLOUDINARY_API_KEY

CLOUDINARY_API_SECRET

RAZORPAY_KEY_ID

RAZORPAY_KEY_SECRET

FRONTEND_URL

NODE_ENV

---

# Error Handling

Every API returns

success

message

data

Example

{
   "success":true,
   "message":"Report Generated",
   "data":{}
}

Errors

{
   "success":false,
   "message":"Image validation failed."
}

Never expose stack traces.

---

# Logging

Log

Request

Response time

Errors

AI latency

Payment verification

Do NOT log

Credit card data

Secrets

API Keys

---

# Security

Helmet

CORS

Request size limit

Input validation

Environment variables

HTTPS only

No secrets in frontend

---

# Image Rules

Allowed

jpg

jpeg

png

webp

Maximum

10 MB

Maximum

One image

One palm

---

# Performance Targets

Upload

<5 sec

Vision analysis

<20 sec

Report generation

<20 sec

Total AI pipeline

<40 sec

API response

<300 ms
(excluding AI)

---

# Future Scalability

Future services

Email Service

Notification Service

PDF Service

Analytics

Admin Dashboard

Queue Workers

Keep MVP as a modular monolith.

Do NOT introduce microservices.

---

# Deployment

Frontend

Vercel

Backend

Northflank

MongoDB

Atlas

Images

Cloudinary

No Docker customization unless Northflank requires it.

---

# Acceptance Criteria

✓ Backend deploys successfully on Northflank.

✓ MongoDB connection established.

✓ Cloudinary upload works.

✓ AI report generation works.

✓ Razorpay webhook verifies payment.

✓ Report saved successfully.

✓ APIs return consistent JSON.

✓ No sensitive data exposed.

✓ Folder structure remains modular.

✓ New AI providers can be swapped with minimal code changes.