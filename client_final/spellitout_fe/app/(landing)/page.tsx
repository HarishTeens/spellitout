import { Hero } from "@/components/landing/hero";
import { NavBar } from "@/components/landing/navbar";
import { Feature } from "@/components/landing/feature";

const LandingPage = () => {
  return (
    <>
      <NavBar />
      <Hero />
      <Feature />
    </>
  );
};

export default LandingPage;
