import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSolutionSection from "@/components/landing/ProblemSolutionSection";
import ServicesSection from "@/components/landing/ServicesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FeaturesGridSection from "@/components/landing/FeaturesGridSection";
import FAQSection from "@/components/landing/FAQSection";
import FinalCTASection from "@/components/landing/FinalCTASection";
import Scene3DWrapper from "@/components/3d/Scene3DWrapper";
import FloatingFlagsWrapper from "@/components/effects/FloatingFlagsWrapper";
import ChatBotWrapper from "@/components/chat/ChatBotWrapper";

export default function Home() {
  return (
    <main className="relative">
      {/* Full-page 3D background */}
      <Scene3DWrapper />

      {/* Floating country flags */}
      <FloatingFlagsWrapper />

      {/* Content layers above the 3D scene */}
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <ProblemSolutionSection />
        <ServicesSection />
        <HowItWorksSection />
        <FeaturesGridSection />
        <FAQSection />
        <FinalCTASection />
        <Footer />
      </div>

      {/* AI Chatbot */}
      <ChatBotWrapper />
    </main>
  );
}
