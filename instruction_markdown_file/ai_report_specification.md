# 12_AI_REPORT_SPECIFICATION.md

# astrologer.ai
## AI Report Specification

Version 1.0

---

# Objective

Define the exact structure, format, and rendering rules for every AI-generated palm reading report.

Every customer should receive a report that is:

• Consistent

• Premium

• Easy to read

• Personalized

• Mobile friendly

• Generated from the AI pipeline

This document defines the contract between the AI backend and the frontend.

---

# Report Overview

The report is generated immediately after a successful palm scan.

The full report is stored before payment.

Users initially see only a preview.

After payment, the complete report is unlocked instantly.

---

# Report Metadata

Every report should include:

Report ID

Created Timestamp

Vision Model Version

LLM Model Version

Vision Prompt Version

Report Prompt Version

Image Quality

Confidence Score

Language

---

# JSON Schema

```json
{
  "metadata": {
    "reportId": "",
    "createdAt": "",
    "language": "en",
    "confidence": 0.92,
    "visionModel": "",
    "llmModel": "",
    "visionPromptVersion": "1.0.0",
    "reportPromptVersion": "1.0.0"
  },
  "sections": {
    "personality": "",
    "love": "",
    "career": "",
    "health": "",
    "strengths": [],
    "growthAreas": [],
    "luckyElements": {
      "color": "",
      "number": "",
      "day": "",
      "trait": ""
    },
    "summary": ""
  }
}
```

---

# Section Order

The order must never change.

1.

Overall Personality

↓

2.

Love & Relationships

↓

3.

Career & Purpose

↓

4.

Health & Wellbeing

↓

5.

Strengths

↓

6.

Growth Opportunities

↓

7.

Lucky Elements

↓

8.

Final Reflection

---

# Section Specifications

## 1. Overall Personality

Purpose

Introduce the reader.

Length

180–220 words.

Describe

• General personality

• Thinking style

• Decision making

• Emotional tendencies

Avoid labels.

Avoid absolute statements.

---

## 2. Love & Relationships

Length

150–180 words.

Discuss

• Communication style

• Emotional expression

• Relationship tendencies

Never predict

Marriage

Divorce

Specific partners

Dates

---

## 3. Career & Purpose

Length

150–180 words.

Discuss

• Work preferences

• Leadership

• Creativity

• Growth

Never mention

Specific professions

Guaranteed promotions

Income predictions

---

## 4. Health & Wellbeing

Length

100–140 words.

Focus on

General wellbeing

Stress

Balance

Lifestyle

Never diagnose.

Never replace medical advice.

---

## 5. Strengths

Exactly 5 bullet points.

Each bullet

15–30 words.

Positive.

Actionable.

Example

• You tend to remain calm when facing uncertainty, allowing you to make thoughtful decisions under pressure.

---

## 6. Growth Opportunities

Exactly 5 bullet points.

Each bullet

15–30 words.

Constructive.

Encouraging.

Never negative.

---

## 7. Lucky Elements

Display as cards.

Include

Lucky Color

Lucky Number

Lucky Day

Trait to Focus On

Example

Lucky Color

Deep Blue

Lucky Number

7

Lucky Day

Thursday

Trait to Focus On

Patience

Present as fun guidance.

Never claim certainty.

---

## 8. Final Reflection

Length

100–120 words.

Purpose

Leave the reader feeling

Hopeful

Motivated

Curious

Confident

End with encouragement.

Never create fear.

---

# Preview Generation

The preview is automatically created after the report is generated.

Display

• Report Title

• Personality section

• Beginning of Love section

Everything below should be blurred.

CTA

Unlock Your Complete Reading

---

# Report Rendering

Use cards.

One section per card.

Spacing

32px

Rounded corners

16px

Soft shadows

Readable typography

Dark theme

Large headings

Comfortable line spacing

---

# Mobile Experience

The report should be optimized for vertical scrolling.

Maximum reading width

720px

Cards should stack vertically.

No horizontal scrolling.

---

# Typography

Heading

32px

Section Heading

24px

Body

18px

Line Height

1.7

---

# Markdown Rules

Allowed

##

Paragraphs

Bullet Lists

Bold

Not Allowed

Tables

Code Blocks

HTML

Images

Emojis

---

# Personalization Rules

Every section should reference observations derived from the Vision JSON.

Avoid repeating the same observation across multiple sections.

The report should feel unique for each user while maintaining a consistent structure.

---

# Confidence Handling

If the confidence score is below the acceptable threshold,

do not generate a report.

Instead prompt the user to upload another image.

Reason examples:

• Palm not fully visible

• Image blurry

• Poor lighting

• Multiple hands detected

---

# Error States

If report generation fails

Show

"We couldn't generate your reading this time. Please try another image."

Do not expose technical errors.

---

# Accessibility

Minimum text contrast should meet WCAG AA.

Support screen readers.

Headings should use semantic HTML.

Buttons must have accessible labels.

---

# Future Enhancements

Not part of MVP.

Potential additions:

• Download PDF

• Audio narration

• Multi-language reports

• AI follow-up chat

• Compatibility reports

• Weekly insights

---

# Acceptance Criteria

✓ Report follows the exact section order.

✓ JSON schema matches specification.

✓ Preview is automatically generated.

✓ Report is mobile responsive.

✓ Typography is consistent.

✓ Section lengths stay within defined ranges.

✓ No unsafe predictions are included.

✓ Lucky Elements are presented as optional guidance.

✓ Final Reflection ends on a positive and encouraging note.

✓ Frontend can render every report using only the defined JSON structure.