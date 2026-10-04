import React from 'react';
import { ArrowRight, Activity, Radio, CloudRain, Droplets, Compass, ShieldCheck } from 'lucide-react';

export default function HeroSection() {
  return (
    <section
      id="solution"
      style={{
        position: 'relative',
        paddingTop: '8.5rem',
        paddingBottom: '5.5rem',
        overflow: 'hidden',
      }}
    >
      {/* Background Topographic Wavy Contour Lines */}
      <div className="contour-bg" />

      {/* Decorative ambient radial light */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center',
          }}
        >
          {/* Left Hero Content */}
          <div>
            {/* Small monospace eyebrow with green dot */}
            <div className="eyebrow">
              <span className="green-dot" />
              AI + IoT early warning · Northeast India
            </div>

            {/* Main Heading */}
            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
                fontWeight: 800,
                lineHeight: 1.12,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                marginBottom: '1.25rem',
              }}
            >
              Reading the slope <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 50%, #10b981 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                before it fails.
              </span>
            </h1>

            {/* Paragraph */}
            <p
              style={{
                fontSize: '1.125rem',
                color: '#cbd5e1',
                maxWidth: '580px',
                marginBottom: '2.25rem',
                lineHeight: 1.7,
              }}
            >
              TerraShift fuses rainfall, soil moisture and ground-tilt sensors with AI risk modelling and GIS mapping, giving authorities and communities in the Northeast a warning window before a landslide happens — not after.
            </p>

            {/* Two Action Buttons */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '3.5rem',
              }}
            >
              <a href="#live-dashboard" className="btn-primary">
                Try the live dashboard <ArrowRight size={18} />
              </a>
              <a href="#how-it-works" className="btn-outline">
                See the approach
              </a>
            </div>

            {/* Three stats underneath, separated by thin dividers */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                paddingTop: '1.75rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ paddingRight: '1rem', borderRight: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div className="font-mono" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#4ade80', lineHeight: 1 }}>
                  6
                </div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.35rem', fontWeight: 500 }}>
                  stage detection pipeline
                </div>
              </div>

              <div style={{ paddingRight: '1rem', paddingLeft: '0.5rem', borderRight: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div className="font-mono" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#4ade80', lineHeight: 1 }}>
                  24/7
                </div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.35rem', fontWeight: 500 }}>
                  continuous monitoring
                </div>
              </div>

              <div style={{ paddingLeft: '0.5rem' }}>
                <div className="font-mono" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#4ade80', lineHeight: 1 }}>
                  4
                </div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.35rem', fontWeight: 500 }}>
                  risk classes tracked
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Card: Station Live Monitoring Preview */}
          <div>
            <div className="card-dark" style={{ border: '1px solid rgba(34, 197, 94, 0.25)', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '1.2rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Radio size={18} color="#22c55e" />
                  <span style={{ fontWeight: 600, fontSize: '0.98rem', color: '#f8fafc' }}>
                    Station · Zone 3, Mawsynram sector
                  </span>
                </div>
                <div
                  className="font-mono"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    backgroundColor: 'rgba(249, 115, 22, 0.12)',
                    border: '1px solid rgba(249, 115, 22, 0.3)',
                    color: '#fb923c',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  <span className="orange-dot" /> LIVE
                </div>
              </div>

              {/* Metric Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#cbd5e1', fontSize: '0.92rem' }}>
                    <CloudRain size={16} color="#38bdf8" /> Rainfall intensity
                  </div>
                  <span className="font-mono" style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '1rem' }}>
                    62 mm/hr
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#cbd5e1', fontSize: '0.92rem' }}>
                    <Droplets size={16} color="#60a5fa" /> Soil moisture
                  </div>
                  <span className="font-mono" style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '1rem' }}>
                    71 %
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#cbd5e1', fontSize: '0.92rem' }}>
                    <Compass size={16} color="#fbbf24" /> Slope tilt
                  </div>
                  <span className="font-mono" style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '1rem' }}>
                    3.4°
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#cbd5e1', fontSize: '0.92rem' }}>
                    <ShieldCheck size={16} color="#4ade80" /> Model confidence
                  </div>
                  <span className="font-mono" style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '1rem' }}>
                    92 %
                  </span>
                </div>

                {/* Current Risk Band Row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(249, 115, 22, 0.08)',
                    border: '1px solid rgba(249, 115, 22, 0.25)',
                    marginTop: '0.25rem',
                  }}
                >
                  <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.92rem' }}>Current risk band</span>
                  <span className="badge badge-high" style={{ fontSize: '0.88rem', padding: '0.35rem 0.85rem' }}>
                    High (orange)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
