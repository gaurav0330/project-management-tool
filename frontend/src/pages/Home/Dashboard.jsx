import React from "react";
import TrelloSection, { FeaturesSection, TestimonialsSection } from "../../components/dashboard/LandingPage";

// ✅ Import new components
import HeroSection from "../../components/dashboard/HeroSection";
import HowItWorksSection from "../../components/dashboard/HowItWorksSection";
import UseCasesSection from "../../components/dashboard/UseCasesSection";
import FAQSection from "../../components/dashboard/FAQSection";
import CTASection from "../../components/dashboard/CTASection";
import StatsSection from "../../components/dashboard/StatsSection";

import { useWindowSize } from "../../hooks/useWindowSize"; // Adjust the import path as necessary

const Dashboard = () => {
  const { width } = useWindowSize();
  const isMobile = width < 768; // Tailwind md breakpoint

  return (
    <>
      {/* 🎯 Hero Section */}
      <HeroSection isMobile={isMobile} />

      {/* 📊 Stats Section */}
      <StatsSection isMobile={isMobile} />

      {/* 🔧 Existing TrelloSection */}
      <TrelloSection isMobile={isMobile} />

      {/* ❓ How It Works */}
      <HowItWorksSection isMobile={isMobile} />

      {/* 🎯 Use Cases */}
      <UseCasesSection isMobile={isMobile} />

      {/* ✨ Features */}
      <FeaturesSection isMobile={isMobile} />

      {/* 💬 Testimonials */}
      <TestimonialsSection isMobile={isMobile} />

      {/* ❓ FAQ */}
      <FAQSection isMobile={isMobile} />

      {/* 🚀 CTA */}
      {/* <CTASection isMobile={isMobile} /> */}
    </>
  );
};

export default Dashboard;
