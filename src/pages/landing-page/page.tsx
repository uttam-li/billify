import CallToAction from "./call-to-action";
import Features from "./featurs";
import HeroSection from "./herosection";
import AppHeader from "./header";
import AppFooter from "./footer";

function LandingPage2() {
  return (
    <>
      <AppHeader />
      <main className="space-y-40 mb-40">
        <HeroSection />
        <Features />
        <CallToAction />
      </main>
      <AppFooter />
    </>
  );
}

export default LandingPage2;
