# 07_PALM_SCAN_AND_REPORT.md

# astrologer.ai
## Palm Scan & Report Specification

Version: 1.0

---

# Goal

Convert curiosity into confidence.

The scan should make users feel that the system is genuinely analyzing *their* palm, not showing a generic report.

The report should feel:

• Personal
• Beautiful
• Easy to read
• Premium
• Positive
• Thought-provoking

The report should avoid fear-based predictions or absolute claims.

---

# User Flow

Landing

↓

Scan My Palm

↓

Upload Palm

↓

Image Validation

↓

Palm Analysis Animation

↓

Report Preview

↓

Payment

↓

Complete Report

---

# Upload Screen

Headline

Upload your palm

Subheading

Upload a clear photo of your palm for the most accurate AI analysis.

Show a sample image.

Requirements

✓ Entire palm visible

✓ Fingers visible

✓ Good lighting

✓ No blur

✓ One hand only

Button

Upload Palm

Supported

JPG

PNG

WEBP

Maximum

10 MB

---

# Image Validation

Immediately after upload.

Checks

• Image uploaded

• One palm detected

• Palm facing camera

• Sufficient brightness

• Sharp enough

• Entire palm visible

If validation fails

Show friendly message.

Example

"We couldn't clearly detect your palm. Please upload another image with better lighting."

Never blame the user.

---

# Analysis Animation

Duration

4–6 seconds

Purpose

Increase trust.

Never use a loading spinner.

Instead show progressive analysis.

Timeline

0 sec

Uploading image...

↓

1 sec

Palm detected ✓

↓

2 sec

Identifying major lines...

↓

3 sec

Heart Line ✓

Life Line ✓

↓

4 sec

Head Line ✓

Fate Line ✓

↓

5 sec

Looking for unique patterns...

↓

6 sec

Preparing your personalized report...

---

# Visual Animation

Palm image appears.

Golden scanning beam moves downward.

Detected lines glow softly.

Particles float in background.

Soft ambient glow.

No harsh effects.

---

# Report Preview

Purpose

Convince users the report already exists.

Do NOT ask for payment immediately after upload.

Preview should display approximately 20% of the report.

Show the Personality section in full and the opening of the Love section.

Blur everything below.

Example

---------------------------------

PERSONALITY

"You approach life with a thoughtful and reflective nature..."

---------------------------------

LOVE

"You value deep emotional connections..."

[Blur — rest of Love section and all sections below]

---------------------------------

CAREER

[Blur]

---------------------------------

HEALTH

[Blur]

---------------------------------

Button

Unlock Your Complete Reading

₹5 Introductory Offer

---

# Complete Report Structure

The report should be divided into clear sections.

Each section should feel independent.

Recommended reading time

4–6 minutes.

---

# Cover

Title

Your AI Palm Reading

Generated Today

Small illustration of the uploaded palm.

---

# Section 1

Overall Personality

Length

180–220 words

Topics

• Personality

• Decision making

• Emotional style

• Natural strengths

Positive tone.

---

# Section 2

Heart Line

Heading

Love & Relationships

Length

150–180 words

Discuss

• Emotional openness

• Trust

• Communication

• Romantic style

Avoid deterministic statements.

Instead of

"You will marry at 28."

Say

"You tend to value long-term emotional stability."

---

# Section 3

Head Line + Fate Line

Career & Purpose

Length

150–180 words

Discuss

• Learning style

• Creativity

• Leadership

• Problem solving

• Career evolution

• Direction

• Personal growth

• Ambition

---

# Section 4

Life Line

Health & Wellbeing

Length

100–140 words

Topics

• Energy

• Balance

• Adaptability

• Lifestyle habits

Never diagnose disease.

Never mention lifespan.

---

# Section 5

Strengths

Show as bullet points.

Exactly 5 bullet points.

Each bullet

15–30 words.

Example

✓ Strong intuition

✓ Practical thinker

✓ Loyal in relationships

✓ Calm under pressure

✓ Persistent and determined

---

# Section 6

Growth Opportunities

Exactly 5 bullet points.

Each bullet

15–30 words.

Keep constructive.

Example

• Trust yourself more.

• Communicate emotions openly.

• Avoid overthinking.

Never use fear.

---

# Section 7

Lucky Elements

Fun section.

Include

Lucky Color

Lucky Number

Lucky Day

Lucky Trait

Clearly label these as traditional palmistry-inspired insights.

---

# Section 8

Final Reflection

100–120 words.

Positive ending.

Example

"Your palm reflects resilience, curiosity and emotional depth. While no palm can predict the future with certainty, it can encourage meaningful reflection on your strengths and opportunities."

---

# Writing Style

Short paragraphs.

No walls of text.

No jargon.

Easy English.

Premium tone.

Never sensational.

Never use ALL CAPS.

---

# AI Prompt Guidelines

The model should:

✓ Be optimistic.

✓ Be encouraging.

✓ Sound wise.

✓ Avoid medical advice.

✓ Avoid financial guarantees.

✓ Avoid exact future predictions.

✓ Avoid fear-based language.

✓ Make every report feel unique.

---

# Safety Rules

Never claim certainty.

Instead of

"You will become rich."

Say

"You may find opportunities for financial growth when you combine discipline with persistence."

Instead of

"You have heart disease."

Say

"Take this as inspiration for self-reflection rather than a medical assessment."

---

# Future Enhancements

• Download PDF

• Share Report

• Save Report

• Compare Both Hands

• Monthly AI Guidance

• AI Chat about the report

• Voice narration

---

# Acceptance Criteria

✓ Upload takes less than 10 seconds.

✓ Analysis animation lasts 4–6 seconds.

✓ Preview creates curiosity.

✓ Payment appears only after preview.

✓ Report feels personalized.

✓ Reading time is approximately 5 minutes.

✓ User finishes feeling positive and satisfied.

✓ No medical, legal or financial advice is presented as fact.

✓ The report encourages reflection rather than making definitive predictions.