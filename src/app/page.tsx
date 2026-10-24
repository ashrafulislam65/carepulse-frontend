import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Roles from "@/components/landing/Roles";
import Cta from "@/components/landing/Cta";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Roles />
      <Cta />
    </>
  );
}