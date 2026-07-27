import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FAQSection from "@/components/landing/FAQSection";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <BenefitsSection />
        <TestimonialsSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
