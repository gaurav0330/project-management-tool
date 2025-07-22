import React from 'react'
import TrelloSection, { FeaturesSection, TestimonialsSection } from '../../components/dashboard/LandingPage'

// ✅ Import new components
import HeroSection from '../../components/dashboard/HeroSection';
import HowItWorksSection from '../../components/dashboard/HowItWorksSection';
import UseCasesSection from '../../components/dashboard/UseCasesSection';
import FAQSection from '../../components/dashboard/FAQSection';
import CTASection from '../../components/dashboard/CTASection';
import StatsSection from '../../components/dashboard/StatsSection';

const Dashboard = () => {
  return (
    <>
    
    
      {/* 🎯 Hero Section */}
      <HeroSection />
      
      {/* 📊 Stats Section */}
      <StatsSection />
      
      {/* 🔧 Existing TrelloSection */}
      <TrelloSection />
      
      {/* ❓ How It Works */}
      <HowItWorksSection />
      
      {/* 🎯 Use Cases */}
      <UseCasesSection />
      
      {/* ✨ Features */}
      <FeaturesSection />
      
      {/* 💬 Testimonials */}
      <TestimonialsSection />
      
      {/* ❓ FAQ */}
      <FAQSection />
      
      {/* 🚀 CTA */}
      {/* <CTASection /> */}
    
    </>
  )
}

export default Dashboard
