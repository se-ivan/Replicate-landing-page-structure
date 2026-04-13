import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { DifferentSection } from "./components/DifferentSection";
import { StepsSection } from "./components/StepsSection";
import { HomeGardenSection } from "./components/HomeGardenSection";
import { TestimonialSection } from "./components/TestimonialSection";
import { LatestWorksSection } from "./components/LatestWorksSection";
import { CTASection } from "./components/CTASection";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="w-full min-h-screen bg-[#f5f2ec]">
      <Navbar />
      <HeroSection />
      <DifferentSection />
      <StepsSection />
      <HomeGardenSection />
      <TestimonialSection />
      <LatestWorksSection />
      <CTASection />
      <Footer />
    </div>
  );
}
