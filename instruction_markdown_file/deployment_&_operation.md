# 10_DEPLOYMENT_AND_OPERATIONS.md

# astrologer.ai
## Deployment & Operations Guide

Version 1.0

---

# Objective

Deploy and operate the MVP with minimum operational complexity.

The system should be:

• Stable

• Easy to deploy

• Easy to debug

• Low maintenance

Avoid enterprise infrastructure.

---

# Production Architecture

                Meta Ads
                    │
                    ▼
             Vercel Frontend
                    │
                    ▼
          Northflank Backend API
                    │
      ┌─────────────┼─────────────┐
      │             │             │
      ▼             ▼             ▼
 MongoDB Atlas   Cloudinary    OpenAI API
                    │
                    ▼
                Razorpay

---

# Hosting

Frontend

Platform

Vercel

Reason

• Excellent Next.js support

• Free Hobby plan initially

• Fast global CDN

---

Backend

Platform

Northflank

Reason

• Already familiar

• Good free tier

• Easy GitHub deployment

• Automatic HTTPS

---

Database

MongoDB Atlas

Reason

• Managed

• Reliable

• Free tier sufficient

---

Image Storage

Cloudinary

Reason

• Simple upload API

• Free tier

• Automatic optimization

• CDN included

---

AI Provider

OpenAI

Future-ready

Architecture should allow replacing OpenAI with Gemini, Claude, or another provider without major code changes.

---

# Environment Variables

Frontend (.env.local)

NEXT_PUBLIC_API_URL

Backend (.env)

PORT

NODE_ENV

MONGODB_URI

OPENAI_API_KEY

CLOUDINARY_CLOUD_NAME

CLOUDINARY_API_KEY

CLOUDINARY_API_SECRET

RAZORPAY_KEY_ID

RAZORPAY_KEY_SECRET

FRONTEND_URL

Never commit .env files.

---

# Git Strategy

Main Branch

main

Development Branch

develop

Feature branches

feature/upload

feature/payment

feature/report

Merge

Feature

↓

Develop

↓

Main

Never develop directly on main.

---

# Deployment Flow

Developer pushes code

↓

GitHub

↓

Automatic deployment

↓

Northflank builds backend

↓

Vercel builds frontend

↓

Production updated

---

# Build Commands

Frontend

npm install

npm run build

Backend

npm install

npm run build

npm run start

---

# Production Domains

Frontend

https://astrologer.ai

Backend

https://api.astrologer.ai

Future

Admin

https://admin.astrologer.ai

Not required for MVP.

---

# SSL

HTTPS everywhere.

Redirect HTTP

↓

HTTPS

---

# Logging

Log

API Requests

AI Errors

Payment Errors

Database Errors

Startup

Deployment

Do NOT log

Passwords

API Keys

Payment signatures

Personal report contents

---

# Monitoring

Simple monitoring only.

Health endpoint

GET

/api/health

Northflank can periodically check this endpoint.

Health Response

{
    "status":"healthy",

    "database":"connected",

    "ai":"online",

    "payments":"online"
}

---

# Error Handling

If MongoDB unavailable

Return

503

Database temporarily unavailable.

---

If AI unavailable

Return

503

Analysis service temporarily unavailable.

---

If Cloudinary unavailable

Return

503

Upload service temporarily unavailable.

---

If Razorpay unavailable

Return

503

Payment service temporarily unavailable.

Never expose stack traces.

---

# Backups

MongoDB Atlas

Daily automatic backups (if available on chosen plan)

Cloudinary

Original image retained

Future

Export reports to object storage

Not required for MVP.

---

# Security

Helmet

CORS

Input validation

Environment variables

HTTPS

Request size limits

Rate limiting

No secrets in frontend

---

# Performance Targets

Landing Page

<2 seconds

Image Upload

<5 seconds

AI Analysis (Vision)

<20 seconds

AI Analysis (Report Generation)

<20 seconds

Total AI Pipeline

<40 seconds

Payment

<3 seconds

Report Display

<1 second after payment

---

# Failure Recovery

Upload fails

↓

Retry upload

AI fails

↓

Retry analysis

Payment fails

↓

Retry payment

Webhook delayed

↓

Poll report status

Never regenerate report unless absolutely necessary.

---

# Maintenance

Weekly

Review logs

Monthly

Rotate API keys (if needed)

Quarterly

Review dependencies

Update packages

---

# Cost Estimate (MVP)

Vercel

Free / Hobby

Northflank

Free tier initially

MongoDB Atlas

Free tier

Cloudinary

Free tier

OpenAI

Pay-as-you-go

Razorpay

Transaction fees only

Estimated monthly infrastructure cost

Very low until traffic grows.

---

# Future Improvements

Redis caching

Email service

PDF generation

Queue workers

Admin dashboard

Analytics dashboard

CDN optimization

Do NOT implement for MVP.

---

# Incident Checklist

If production is down

1. Check Northflank deployment

2. Check MongoDB connection

3. Check OpenAI status

4. Check Cloudinary status

5. Check Razorpay status

6. Review logs

7. Redeploy if necessary

---

# Acceptance Criteria

✓ Frontend deploys successfully on Vercel.

✓ Backend deploys successfully on Northflank.

✓ MongoDB connects automatically.

✓ Cloudinary uploads work.

✓ Razorpay payment flow functions correctly.

✓ HTTPS enabled everywhere.

✓ Health endpoint reports service status.

✓ Environment variables remain secure.

✓ Deployment requires minimal manual intervention.

✓ MVP can be maintained by a single developer.