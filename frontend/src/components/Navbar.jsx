import React, { useState, useEffect } from 'react';
import { Mountain, ExternalLink, Menu, X, AlertTriangle } from 'lucide-react';

export default function Navbar({ onOpenVideo }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('solution');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ['solution', 'how-it-works', 'live-dashboard', 'technical-approach', 'impact'];
      const scrollPosition = window.scrollY + 150;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Solution', href: '#solution', id: 'solution' },
    { name: 'How it works', href: '#how-it-works', id: 'how-it-works' },
    { name: 'Live dashboard', href: '#live-dashboard', id: 'live-dashboard' },
    { name: 'Sensors', href: '#sensor-integration', id: 'sensor-integration' },
    { name: 'Impact', href: '#impact', id: 'impact' },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: scrolled ? 'rgba(6, 12, 8, 0.88)' : 'rgba(6, 12, 8, 0.4)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: scrolled ? '1px solid rgba(34, 197, 94, 0.15)' : '1px solid rgba(255, 255, 255, 0.05)',
        transition: 'all 0.3s ease',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4.5rem' }}>
        {/* Left: Brand Icon + Title */}
        <a href="#solution" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none', color: '#ffffff' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(16,185,129,0.05) 100%)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(34,197,94,0.25)',
            }}
          >
            <Mountain size={22} color="#22c55e" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#f0fdf4' }}>
            Land slide<span style={{ color: '#22c55e', margin: '5px' }}>Detection</span>
          </span>
        </a>

        {/* Center: Navigation Links */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="desktop-nav">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.name}
                href={link.href}
                style={{
                  color: isActive ? '#4ade80' : '#94a3b8',
                  fontSize: '0.95rem',
                  fontWeight: isActive ? 600 : 500,
                  textDecoration: 'none',
                  position: 'relative',
                  padding: '0.4rem 0',
                  transition: 'color 0.2s ease',
                }}
              >
                {link.name}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      backgroundColor: '#22c55e',
                      borderRadius: '2px',
                      boxShadow: '0 0 8px #22c55e',
                    }}
                  />
                )}
              </a>
            );
          })}
        </div>

        {/* Right: Monospace Pill Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            className="font-mono"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(34, 197, 94, 0.08)',
              border: '1px solid rgba(34, 197, 94, 0.25)',
              padding: '0.4rem 0.9rem',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#4ade80',
              boxShadow: '0 0 10px rgba(34, 197, 94, 0.1)',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
            Disaster Management
          </div>
        </div>
      </div>
    </nav>
  );
}
