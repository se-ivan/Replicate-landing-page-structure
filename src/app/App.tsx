import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { NewsSection } from "./components/NewsSection";
import { DifferentSection } from "./components/DifferentSection";
import { StepsSection } from "./components/StepsSection";
import { HomeGardenSection } from "./components/HomeGardenSection";
import { TestimonialSection } from "./components/TestimonialSection";
import { LatestWorksSection } from "./components/LatestWorksSection";
import { CTASection } from "./components/CTASection";
import { Footer } from "./components/Footer";
import type { Article } from "../data/articles";
import type { NewsItem } from "../data/news";

type Props = {
  articles?: Article[];
  news?: NewsItem[];
};

export default function App({ articles, news }: Props) {
  return (
    <div className="w-full min-h-screen bg-[#f5f2ec]">
      <Navbar />
      <HeroSection />
      <NewsSection news={news} />
      <DifferentSection />
      <StepsSection />
      <HomeGardenSection />
      <TestimonialSection />
      <LatestWorksSection articles={articles} />
      <CTASection />
      <Footer />
    </div>
  );
}
