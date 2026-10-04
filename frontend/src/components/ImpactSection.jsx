import React from 'react';
import { Users, Shield, Zap, Satellite, Camera, Languages, Heart, ExternalLink } from 'lucide-react';

export default function ImpactSection({ onOpenVideo }) {
  const impactCards = [
    {
      title: 'For communities',
      description: 'People get a warning window, so they have time to migrate before a landslide happens.',
      icon: Users,
      color: '#38bdf8',
    },
    {
      title: 'For authorities',
      description: 'Authorities can see which areas are most unsafe and where services need to be sent.',
      icon: Shield,
      color: '#22c55e',
    },
    {
      title: 'Reliable in remote areas',
      description: 'Data is saved locally when the internet fails, and the system runs on solar power, so it works where network and electricity are not available.',
      icon: Zap,
      color: '#f97316',
    },
  ];

  const futurePlans = [
    { text: 'Add satellite images', icon: Satellite, desc: 'High-resolution Synthetic Aperture Radar (SAR) imagery for broad ground displacement.' },
    { text: 'Let people upload images of landslides', icon: Camera, desc: 'Crowdsourced community photo telemetry for instant ground truth validation.' },
    { text: 'Send alerts in local languages', icon: Languages, desc: 'Multilingual SMS/voice sirens tailored for regional dialects in Northeast India.' },
  ];

  return (
    <section id="impact" style={{ paddingTop: '5.5rem', paddingBottom: '6rem', position: 'relative' }}>
      <div className="container">
        {/* Section Eyebrow & Heading */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem auto' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>
            <span className="green-dot" />
            Impact
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
            Transforming reactive disaster recovery into proactive life-saving
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Designed specifically for vulnerable hilly topography in Meghalaya, Mizoram, Nagaland and Arunachal Pradesh.
          </p>
        </div>

        {/* Three Impact Cards (Dark Card Style) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginBottom: '4.5rem',
          }}
        >
          {impactCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="card-dark"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  padding: '2rem',
                }}
              >
                <div>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <Icon size={24} color={card.color} />
                  </div>

                  <h3
                    style={{
                      fontSize: '1.3rem',
                      fontWeight: 700,
                      color: '#f8fafc',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {card.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.98rem',
                      color: '#cbd5e1',
                      lineHeight: 1.65,
                    }}
                  >
                    "{card.description}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sub-heading: What's Next */}
        <div
          className="card-dark"
          style={{
            padding: '2.5rem',
            marginBottom: '4.5rem',
            background: 'linear-gradient(135deg, rgba(14,25,18,0.9) 0%, rgba(10,20,14,0.95) 100%)',
            border: '1px solid rgba(34, 197, 94, 0.25)',
          }}
        >
          <div style={{ marginBottom: '1.75rem' }}>
            <div className="eyebrow" style={{ marginBottom: '0.5rem' }}>
              ROADMAP
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }}>
              What's next
            </h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {futurePlans.map((plan) => {
              const Icon = plan.icon;
              return (
                <div
                  key={plan.text}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={18} color="#22c55e" />
                    </div>
                    <span style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '1.05rem' }}>
                      {plan.text}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
                    {plan.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Closing Banner & Team Signature */}
        <div
          style={{
            textAlign: 'center',
            maxWidth: '850px',
            margin: '0 auto',
            padding: '3rem 2rem',
            borderRadius: '20px',
            background: 'radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.15) 0%, rgba(6, 12, 8, 0.8) 100%)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            boxShadow: '0 0 50px rgba(34, 197, 94, 0.15)',
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#4ade80', marginBottom: '1.25rem' }}>
            <Heart size={20} fill="#22c55e" color="#22c55e" />
            <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.08em' }}>
              VISION STATEMENT
            </span>
          </div>

          <blockquote
            style={{
              fontSize: 'clamp(1.4rem, 3.5vw, 2.1rem)',
              fontWeight: 800,
              lineHeight: 1.3,
              color: '#ffffff',
              marginBottom: '2rem',
              letterSpacing: '-0.02em',
            }}
          >
            "We are changing the concept of counting the number of losses into saving the number of lives."
          </blockquote>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.01em' }}>
              Landslide Early Warning System (LEWS)
            </div>
            <div className="font-mono" style={{ fontSize: '0.9rem', color: '#4ade80', fontWeight: 600 }}>
              A project by Team Codex
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
