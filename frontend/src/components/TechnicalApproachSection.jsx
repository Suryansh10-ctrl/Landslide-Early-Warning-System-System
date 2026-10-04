import React from 'react';
import { Layout, Server, Brain, Database, Cpu, Map, Radio, Sun, HardDrive } from 'lucide-react';

export default function TechnicalApproachSection() {
  const techGrid = [
    { label: 'FRONTEND', value: 'React.js, HTML/CSS/JavaScript', icon: Layout, color: '#38bdf8' },
    { label: 'BACKEND', value: 'Node.js + Express.js', icon: Server, color: '#a78bfa' },
    { label: 'AI / ML', value: 'Python + Scikit-learn', icon: Brain, color: '#22c55e' },
    { label: 'DATABASE', value: 'MongoDB', icon: Database, color: '#4ade80' },
    { label: 'IOT', value: 'ESP32 + rainfall, soil moisture & tilt sensors', icon: Cpu, color: '#fbbf24' },
    { label: 'GIS', value: 'Interactive maps & risk heatmaps', icon: Map, color: '#f97316' },
    { label: 'COMMUNICATION', value: 'Wi-Fi / LoRa', icon: Radio, color: '#e879f9' },
    { label: 'DEPLOYMENT', value: 'Solar / battery-backed remote stations', icon: Sun, color: '#facc15' },
    { label: 'RESILIENCE', value: 'Local data cache with sync-on-reconnect', icon: HardDrive, color: '#34d399' },
  ];

  return (
    <section id="technical-approach" style={{ paddingTop: '5.5rem', paddingBottom: '5.5rem', position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem auto' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>
            <span className="green-dot" />
            Technical approach
          </div>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              marginBottom: '1rem',
            }}
          >
            Built on lightweight, field-deployable technology
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Designed for remote hilly terrains with zero infrastructure reliance, off-grid solar power resilience, and long-range LoRa telecommunication.
          </p>
        </div>

        {/* 3x3 Grid of Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {techGrid.map((tech) => {
            const Icon = tech.icon;
            return (
              <div
                key={tech.label}
                className="card-dark"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1.1rem',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={22} color={tech.color} />
                </div>

                <div>
                  <div
                    className="font-mono"
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      color: '#4ade80',
                      marginBottom: '0.35rem',
                    }}
                  >
                    {tech.label}
                  </div>
                  <div
                    style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#f8fafc',
                      lineHeight: 1.4,
                    }}
                  >
                    {tech.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
