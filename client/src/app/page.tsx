import Hero from "@/components/home/Hero";
import BrowseByInterest from "@/components/home/BrowseByInterest";
import OrganizerSection from "@/components/home/OrganizerSection";
import HowItWorks from "@/components/home/HowItWorks";
import CommunitySection from "@/components/home/CommunitySection";
import FinalCTA from "@/components/home/FinalCTA";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <BrowseByInterest />
      <OrganizerSection />
      <HowItWorks />
      <CommunitySection />
      <FinalCTA />
      <Footer />
    </main>
  );
}