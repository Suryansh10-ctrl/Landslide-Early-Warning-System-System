import React from 'react';
import { X, Play, ExternalLink } from 'lucide-react';

export default function VideoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        className="card-dark"
        style={{
          maxWidth: '900px',
          width: '100%',
          padding: '1.5rem',
          border: '1px solid rgba(34, 197, 94, 0.4)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Play size={18} color="#22c55e" fill="#22c55e" />
            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#ffffff' }}>
              TerraShift — Official Video Demonstration
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '0.2rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Video Responsive Container */}
        <div
          style={{
            position: 'relative',
            paddingBottom: '56.25%', /* 16:9 aspect ratio */
            height: 0,
            overflow: 'hidden',
            borderRadius: '12px',
            backgroundColor: '#000000',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <iframe
            src="https://www.youtube.com/embed/1IvFlmY-HZk?autoplay=1"
            title="TerraShift — AI Landslide Early Warning Demo Video"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 0,
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Footer Link */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <span className="font-mono" style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            SIH26001 · Disaster Management Innovation
          </span>
          <a
            href="https://www.youtube.com/watch?v=1IvFlmY-HZk"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono"
            style={{ fontSize: '0.8rem', color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            Open on YouTube <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
