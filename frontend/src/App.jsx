import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import HowItWorksSection from './components/HowItWorksSection';
import InteractiveDashboard from './components/InteractiveDashboard';
import TechnicalApproachSection from './components/TechnicalApproachSection';
import SensorIntegrationGuide from './components/SensorIntegrationGuide';
import ImpactSection from './components/ImpactSection';
import VideoModal from './components/VideoModal';
import Footer from './components/Footer';

export default function App() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-dark)' }}>
      {/* Sticky Blurred Navbar */}
      <Navbar onOpenVideo={() => setIsVideoOpen(true)} />

      {/* Hero Section */}
      <HeroSection />

      {/* How It Works Section (6 Stages) */}
      <HowItWorksSection />

      {/* Interactive Demo Section (Live Dashboard) */}
      <InteractiveDashboard />

      {/* Technical Approach Section (3x3 Grid) */}
      <TechnicalApproachSection />

      {/* Hardware & Sensors Integration Architecture Guide */}
      <SensorIntegrationGuide />

      {/* Impact Section */}
      <ImpactSection onOpenVideo={() => setIsVideoOpen(true)} />

      {/* Video Modal Player */}
      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />

      {/* Footer */}
      <Footer onOpenVideo={() => setIsVideoOpen(true)} />
    </div>
  );
}
