# 09_DATABASE_AND_API.md

# astrologer.ai
## Database & API Specification

Version 1.0

---

# Objective

Define all database collections and backend APIs required for the MVP.

Principles

• Keep schema simple
• Avoid unnecessary relationships
• Store only essential data
• Optimize for speed of development

---

# Database

MongoDB Atlas

Collections

1. Reports

2. Payments

No user authentication required for MVP.

---

# Collection 1

reports

Purpose

Store uploaded image and generated report.

Schema

{
    "_id": ObjectId,

    "reportId": String,

    "email": String,

    "phone": String,

    "imageUrl": String,

    "preview": Object,

    "fullReport": Object,

    "analysis": Object,

    "paymentStatus": "pending | paid",

    "paymentId": String,

    "createdAt": Date,

    "updatedAt": Date
}

Indexes

reportId

paymentStatus

createdAt

---

# Preview Object

{
   "personality":"You approach life with a thoughtful and reflective nature...",

   "love":"You value meaningful relationships..."
}

Keep previews short.

Approximately 30–40 words each.

---

# Analysis Object

Raw structured AI output.

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

Never expose directly to frontend.

---

# Full Report Object

{
   "metadata":{
      "reportId":"",
      "createdAt":"",
      "language":"en",
      "confidence":0.0,
      "visionModel":"",
      "llmModel":"",
      "visionPromptVersion":"1.0.0",
      "reportPromptVersion":"1.0.0"
   },

   "sections":{
      "personality":"",

      "love":"",

      "career":"",

      "health":"",

      "strengths":[ ],

      "growthAreas":[ ],

      "luckyElements":{

      },

      "summary":""
   }
}

---

# Collection 2

payments

Purpose

Maintain payment history.

Schema

{
   "_id":ObjectId,

   "reportId":String,

   "razorpayOrderId":String,

   "razorpayPaymentId":String,

   "amount":Number,

   "currency":"INR",

   "status":"created | paid | failed",

   "createdAt":Date
}

Indexes

razorpayOrderId

status

createdAt

---

# API Overview

POST

/api/upload-palm

POST

/api/analyze

POST

/api/create-order

POST

/api/verify-payment

GET

/api/report/:reportId

GET

/api/health

Only six endpoints for MVP.

---

# API 1

POST

/api/upload-palm

Purpose

Upload palm image.

Request

multipart/form-data

Fields

image

Response

{
    "success":true,

    "imageUrl":"",

    "message":"Upload Successful"
}

Validation

Required

Image

Maximum

10MB

Formats

jpg

jpeg

png

webp

Errors

400

No image

413

Image too large

415

Invalid format

---

# API 2

POST

/api/analyze

Purpose

Run full AI pipeline: vision analysis, full report generation, preview extraction, store report and preview in MongoDB, return preview.

Request

{
    "imageUrl":"..."
}

Flow

Validate

↓

Vision Analysis

↓

Generate Structured JSON

↓

Generate Full Report

↓

Extract Preview

↓

Save to MongoDB

↓

Return Preview

Response

{
   "success":true,

   "reportId":"",

   "preview":{

   },

   "paymentStatus":"pending"
}

Possible Errors

Palm not detected

Poor lighting

AI timeout

---

# API 3

POST

/api/create-order

Purpose

Generate Razorpay order.

Request

{
   "reportId":"",

   "email":"",

   "phone":""
}

Backend

Creates Razorpay order.

Stores email and phone to report.

Stores order.

Returns payment information.

Response

{
   "success":true,

   "orderId":"",

   "amount":500,

   "currency":"INR",

   "key":"rzp_live_xxxxx"
}

Note

Amount is in paise.

₹5 = 500

Future pricing should come from configuration, not hardcoded values.

---

# API 4

POST

/api/verify-payment

Purpose

Verify Razorpay payment.

Request

{
   "reportId":"",

   "razorpay_order_id":"",

   "razorpay_payment_id":"",

   "razorpay_signature":""
}

Flow

Verify Signature

↓

Update Payment

↓

Unlock Report

↓

Return Success

Response

{
   "success":true,

   "paymentStatus":"paid"
}

If verification fails

Return

401

---

# API 5

GET

/api/report/:reportId

Purpose

Return report.

Logic

If payment pending

Return Preview

If payment complete

Return Full Report

Response

{
   "paymentStatus":"paid",

   "report":{

   }
}

---

# API 6

GET

/api/health

Purpose

Health monitoring.

Response

{
   "status":"healthy",

   "database":"connected",

   "ai":"online",

   "payments":"online"
}

Used by Northflank.

---

# API Standards

Every response

{
   "success":true,

   "message":"",

   "data":{

   }
}

Never return raw Mongo objects.

Never expose internal IDs.

Never expose API keys.

---

# Error Codes

200

Success

201

Created

400

Bad Request

401

Unauthorized

404

Not Found

413

Payload Too Large

429

Too Many Requests

500

Internal Server Error

---

# File Naming

Reports

reportId

UUID v4

Images

UUID.webp

Never use user filenames.

---

# Retention Policy

Images

Retain for 30 days

Reports

Retain indefinitely

Future

Allow user deletion.

---

# Rate Limits

Upload

10 per hour

Analyze

10 per hour

Payment

Unlimited

Health

Unlimited

Simple in-memory limiter is sufficient for MVP.

---

# Acceptance Criteria

✓ Image uploads successfully.

✓ Report saved in MongoDB.

✓ Preview generated.

✓ Razorpay order created.

✓ Payment verified.

✓ Full report unlocked after payment.

✓ APIs return consistent JSON.

✓ No sensitive data leaked.

✓ Backend can support future AI products with minimal schema changes.