import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import EmailMockup from "@/components/EmailMockup";
import TrustedBySection from "@/components/TrustedBySection";
import FeaturesSection from "@/components/FeaturesSection";
import AiToolsSection from "@/components/AiToolsSection";
import FeaturesShowcase from "@/components/FeaturesShowcase";
import Footer from "@/components/Footer";
import FooterBottom from "@/components/FooterBottom";
import ScrollingBanner from "@/components/ScrollingBanner";
import { CourseCard } from "@/components/CourseCard";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Claim Domain");

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <div className="pt-16 sm:pt-20">
        <HeroSection 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        {activeTab === "Claim Domain" && <EmailMockup />}
        <TrustedBySection />
        <FeaturesSection />
        <AiToolsSection />
        <FeaturesShowcase />
        <Footer />
        <FooterBottom />
        <ScrollingBanner />
        <div className="hidden sm:block">
          <CourseCard />
        </div>
      </div>
    </div>
  );
}
