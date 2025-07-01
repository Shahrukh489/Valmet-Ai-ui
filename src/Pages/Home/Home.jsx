import React from "react";
import Header from "./Header";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import ServicesSection from "./ServicesSection";
import ContactSection from "./ContactSection";
import Footer from "./Footer";

import FeaturesSection from "./FeaturesSection";
import Base from "../../components/Layouts/Base/Base";
import "./Home.css";

function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <HeroSection />
      </section>

      {/* Features Section */}
      <section className="relative py-24 bg-background">
        <div className="container mx-auto px-6">
          <FeaturesSection />
        </div>
      </section>

      {/* Services Section */}
      <section className="relative py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <ServicesSection />
        </div>
      </section>

      {/* About Section
      <section className="relative py-24 bg-background">
        <div className="container mx-auto px-6">
          <AboutSection />
        </div>
      </section> */}

      {/* Contact Section */}
      <section className="relative py-24 bg-muted/50">
        <div className="container mx-auto px-6">
          <ContactSection />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;
