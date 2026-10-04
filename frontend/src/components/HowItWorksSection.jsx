import React from 'react';
import { Droplet, Server, Cpu, Gauge, MapPin, Bell } from 'lucide-react';

export default function HowItWorksSection() {
  const stages = [
    {
      number: '01',
      title: 'Data collection',
      icon: Droplet,
      iconColor: '#38bdf8',
      description: 'Rainfall, soil moisture, tilt and geospatial data via IoT sensors and weather APIs.',
    },
    {
      number: '02',
      title: 'Data processing',
      icon: Server,
      iconColor: '#a78bfa',
      description: 'Sensor readings are cleaned, filtered and validated for accuracy before analysis.',
    },
    {
      number: '03',
      title: 'AI/ML risk analysis',
      icon: Cpu,
      iconColor: '#22c55e',
      description: 'Models trained on environmental and historical data estimate landslide likelihood.',
    },
    {
      number: '04',
      title: 'Risk assessment',
      icon: Gauge,
      iconColor: '#fbbf24',
      description: 'Scores are classified into low, moderate, high and critical risk bands.',
    },
    {
      number: '05',
      title: 'GIS visualization',
      icon: MapPin,
      iconColor: '#f97316',
      description: 'Risk maps highlight vulnerable zones so response can be targeted geographically.',
    },
    {
      number: '06',
      title: 'Early warning',
      icon: Bell,
      iconColor: '#ef4444',
      description: 'Automated alerts reach authorities and communities via dashboard, SMS and email.',
    },
  ];

  return (
    <section id="how-it-works" style={{ paddingTop: '5rem', paddingBottom: '5rem', position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem auto' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>
            <span className="green-dot" />
            How it works
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
            The six stages behind every warning
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.6 }}>
            From IoT edge sensor telemetry to real-time community broadcast — how TerraShift processes environmental parameters into life-saving window warnings.
          </p>
        </div>

        {/* Six Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {stages.map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.number}
                className="card-dark"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  padding: '1.5rem 1.25rem',
                  height: '100%',
                }}
              >
                <div>
                  {/* Top Bar: Stage Number & Icon */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: 'rgba(34, 197, 94, 0.7)',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                      }}
                    >
                      {stage.number}
                    </span>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={19} color={stage.iconColor} />
                    </div>
                  </div>

                  {/* Stage Title */}
                  <h3
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: '#f8fafc',
                      marginBottom: '0.6rem',
                    }}
                  >
                    {stage.title}
                  </h3>

                  {/* Stage Description */}
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: '#94a3b8',
                      lineHeight: 1.55,
                    }}
                  >
                    {stage.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
