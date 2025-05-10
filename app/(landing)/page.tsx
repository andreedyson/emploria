import FAQSection from "@/components/pages/landing/faq-section";
import FeatureSection from "@/components/pages/landing/feature-section";
import HeroSection from "@/components/pages/landing/hero-section";
import LandingBanner from "@/components/pages/landing/landing-banner";
import TechStacksSection from "@/components/pages/landing/tech-stacks-section";

function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <TechStacksSection />
      <FAQSection />
      <LandingBanner />
    </>
  );
}

export default LandingPage;
