// All user-facing strings — single source of truth for copy

export const COPY = {
  brand: "astrologer.ai",
  tagline: "Discover what your palm reveals.",

  hero: {
    headline: "Scan your palm.",
    headlineLine2: "Know your future.",
    subheadline:
      "AI analyzes your palm to reveal personalized insights about your life, career, relationships and more.",
    cta: "Scan My Palm",
  },

  howItWorks: {
    heading: "How it works",
    steps: [
      { number: "01", title: "Upload Palm", desc: "Take a clear photo of your open palm and upload it." },
      { number: "02", title: "AI Analysis", desc: "Our AI reads your major lines and unique palm features." },
      { number: "03", title: "Get Your Report", desc: "Receive a personalized, beautifully written reading." },
    ],
  },

  benefits: {
    heading: "What your palm reveals",
    items: [
      { title: "Relationship Insights", desc: "Understand your emotional patterns and how you connect with others." },
      { title: "Career Guidance", desc: "Discover the strengths that drive your professional path forward." },
      { title: "Health & Energy", desc: "Explore your natural energy levels and what restores you." },
      { title: "Life Potential", desc: "Uncover the deeper tendencies that shape your decisions and direction." },
    ],
  },

  testimonials: {
    heading: "What people are saying",
    items: [
      {
        name: "Priya S.",
        location: "Mumbai",
        text: "I was surprised how accurate the relationship section felt. It described exactly how I approach trust.",
      },
      {
        name: "Arjun M.",
        location: "Bangalore",
        text: "The career section resonated deeply. It gave me clarity I hadn't expected from a palm reading.",
      },
      {
        name: "Meera K.",
        location: "Delhi",
        text: "Beautifully designed and thoughtfully written. Unlike anything I've tried before.",
      },
    ],
  },

  faq: {
    heading: "Common questions",
    items: [
      {
        q: "How accurate is it?",
        a: "Our AI analyzes real palm features from your image. The report is based on traditional palmistry principles combined with AI pattern recognition. Results vary by individual.",
      },
      {
        q: "How long does it take?",
        a: "Upload takes seconds. AI analysis completes in 15–20 seconds. Your report is ready almost immediately.",
      },
      {
        q: "Do I need an account?",
        a: "No account required. Just upload your palm, preview your reading, and pay to unlock — that's it.",
      },
      {
        q: "Is my photo secure?",
        a: "Your image is uploaded securely and used only to generate your reading. Images are not stored beyond 30 days.",
      },
      {
        q: "How much does it cost?",
        a: "Your complete palm reading is available for just ₹5 as an introductory offer.",
      },
    ],
  },

  upload: {
    heading: "Upload your palm",
    subheading: "Upload a clear photo of your palm for the most accurate AI analysis.",
    requirements: [
      "Entire palm visible",
      "Fingers visible",
      "Good lighting",
      "No blur",
      "One hand only",
    ],
    cta: "Upload Palm",
    formats: "JPG, PNG or WEBP · Maximum 10 MB",
    dragText: "Drag your palm photo here",
    orText: "or",
  },

  scan: {
    heading: "Analyzing your palm",
    steps: [
      "Uploading image...",
      "Palm detected ✓",
      "Identifying major lines...",
      "Heart Line ✓  ·  Life Line ✓",
      "Head Line ✓  ·  Fate Line ✓",
      "Looking for unique patterns...",
      "Preparing your personalized report...",
    ],
  },

  preview: {
    heading: "Your Reading is Ready",
    subheading: "Here is a preview of your personalized palm reading.",
    unlockCta: "Unlock Your Complete Reading",
    price: "₹5 Introductory Offer",
    blurLabel: "Unlock to read",
  },

  report: {
    heading: "Your AI Palm Reading",
    generatedLabel: "Generated today",
    sectionTitles: {
      personality: "Overall Personality",
      love: "Love & Relationships",
      career: "Career & Purpose",
      health: "Health & Wellbeing",
      strengths: "Your Strengths",
      growthAreas: "Growth Opportunities",
      luckyElements: "Lucky Elements",
      summary: "Final Reflection",
    },
  },

  footer: {
    links: ["Privacy", "Terms", "Contact"],
    copyright: "© 2026 astrologer.ai",
  },
} as const;
