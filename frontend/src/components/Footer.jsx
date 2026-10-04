import React from 'react';
import { Mountain, ExternalLink } from 'lucide-react';

export default function Footer({ onOpenVideo }) {
  return (
    <footer
      style={{
        backgroundColor: '#040805',
        borderTop: '1px solid rgba(34, 197, 94, 0.15)',
        paddingTop: '3.5rem',
        paddingBottom: '2.5rem',
        color: '#94a3b8',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            paddingBottom: '3rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          {/* Brand Info */}
          <div>
            <a href="#solution" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none', color: '#ffffff', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: 'rgba(34,197,94,0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Mountain size={20} color="#22c55e" />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f0fdf4' }}>
                Land Slide <span style={{ color: '#22c55e' }}>Early Warning System</span>
              </span>
            </a>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, maxWidth: '280px' }}>
              AI + IoT Landslide Early Warning System prototype for Northeast India high-risk terrain.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <div className="font-mono" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4ade80', marginBottom: '1rem', letterSpacing: '0.05em' }}>
              NAVIGATION
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li><a href="#solution" style={{ color: '#94a3b8', textDecoration: 'none' }}>Solution Overview</a></li>
              <li><a href="#how-it-works" style={{ color: '#94a3b8', textDecoration: 'none' }}>How It Works (6 Stages)</a></li>
              <li><a href="#live-dashboard" style={{ color: '#94a3b8', textDecoration: 'none' }}>Interactive Live Simulation</a></li>
              <li><a href="#technical-approach" style={{ color: '#94a3b8', textDecoration: 'none' }}>Technical Stack</a></li>
              <li><a href="#impact" style={{ color: '#94a3b8', textDecoration: 'none' }}>Impact & Roadmap</a></li>
            </ul>
          </div>

          {/* SIH details & Video */}
          <div>
            <div className="font-mono" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4ade80', marginBottom: '1rem', letterSpacing: '0.05em' }}>
              PROJECT DETAILS
            </div>
            <div className="font-mono" style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
              Theme: Disaster Management
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div style={{ paddingTop: '2rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', fontSize: '0.83rem', color: '#64748b' }}>
          <div>
            © {new Date().getFullYear()} Landslide Early Warning System (LEWS) AI. 
          </div>
          <div className="font-mono" style={{ color: '#4ade80' }}>
            "Saving lives, not counting losses."
          </div>
        </div>
      </div>
    </footer>
  );
}
