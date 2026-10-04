import React, { useState, useEffect, useRef } from 'react';
import { CloudRain, Droplets, Compass, ShieldCheck, AlertCircle, Map, Layers, BellRing, Volume2, VolumeX, Send, Database, Server, RefreshCw, Radio } from 'lucide-react';
import confetti from 'canvas-confetti';
import { io } from 'socket.io-client';
import { sendSensorTelemetry, fetchHealthStatus, fetchAlertLogs, postAlertLog } from '../services/api';

export default function InteractiveDashboard() {
  // Slider state: default 72 mm/hr
  const [rainfall, setRainfall] = useState(72);
  const [activeTab, setActiveTab] = useState('zones'); // 'zones' or 'map'
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  // Backend & MongoDB Connection State
  const [backendStatus, setBackendStatus] = useState('checking'); // 'connected', 'offline', 'checking'
  const [mongoStatus, setMongoStatus] = useState('checking');
  const [isLiveStreamActive, setIsLiveStreamActive] = useState(true);

  // Calculated Metrics
  const soilMoisture = Math.min(96, Math.round(35 + rainfall * 0.52));
  const slopeTilt = (1.1 + rainfall * 0.038).toFixed(1);
  const modelConfidence = Math.min(96, Math.round(88 + rainfall * 0.06));

  // Calculated Composite Risk Score (0 - 100)
  const rawScore = Math.round((rainfall / 140) * 55 + (soilMoisture / 96) * 33 + (parseFloat(slopeTilt) / 6.5) * 12);
  const riskScore = Math.min(99, Math.max(12, rawScore));

  // Risk Band Determination
  let riskBand = 'Low';
  let riskBadgeClass = 'badge-low';
  let needleColor = '#22c55e';
  
  if (riskScore >= 80) {
    riskBand = 'Critical';
    riskBadgeClass = 'badge-critical';
    needleColor = '#ef4444';
  } else if (riskScore >= 60) {
    riskBand = 'High';
    riskBadgeClass = 'badge-high';
    needleColor = '#f97316';
  } else if (riskScore >= 38) {
    riskBand = 'Moderate';
    riskBadgeClass = 'badge-moderate';
    needleColor = '#eab308';
  }

  // 6 Monitoring Zones offsets relative to Zone 3
  const zonesData = [
    { id: 1, name: 'Zone 1 · Shillong', offset: -16, lat: '25.5788', lon: '91.8933', x: 42, y: 55 },
    { id: 2, name: 'Zone 2 · Aizawl', offset: -22, lat: '23.7271', lon: '92.7176', x: 50, y: 78 },
    { id: 3, name: 'Zone 3 · Mawsynram', offset: 0, lat: '25.2986', lon: '91.5822', x: 38, y: 62 },
    { id: 4, name: 'Zone 4 · Kohima', offset: -18, lat: '25.6751', lon: '94.1086', x: 68, y: 52 },
    { id: 5, name: 'Zone 5 · Itanagar', offset: -12, lat: '27.0844', lon: '93.6053', x: 62, y: 32 },
    { id: 6, name: 'Zone 6 · Along', offset: -26, lat: '28.1673', lon: '94.7937', x: 78, y: 22 },
  ];

  const processedZones = zonesData.map(z => {
    const zScore = Math.min(99, Math.max(8, riskScore + z.offset));
    let color = '#22c55e';
    let band = 'Low';
    if (zScore >= 80) { color = '#ef4444'; band = 'Critical'; }
    else if (zScore >= 60) { color = '#f97316'; band = 'High'; }
    else if (zScore >= 38) { color = '#eab308'; band = 'Moderate'; }
    return { ...z, score: zScore, color, band };
  });

  // Alert Log entries state
  const [logs, setLogs] = useState([
    { id: 1, time: '01:12:49 am', text: 'Monitoring started. Baseline conditions nominal.', type: 'info' },
    { id: 2, time: '01:14:10 am', text: 'Sensors connected: 6 telemetry nodes active.', type: 'info' },
    { id: 3, time: '01:15:32 am', text: 'Soil saturation model initialized for Mawsynram sector.', type: 'info' },
  ]);

  const prevBandRef = useRef(riskBand);

  // Check Backend & MongoDB Status on Mount
  useEffect(() => {
    async function checkBackend() {
      const health = await fetchHealthStatus();
      if (health && health.status === 'online') {
        setBackendStatus('connected');
        setMongoStatus(health.mongoDB);
      } else {
        setBackendStatus('offline');
        setMongoStatus('Offline');
      }
    }
    checkBackend();

    // Setup Socket.io Realtime Listener
    const socket = io('http://localhost:3000', { autoConnect: true });

    socket.on('connect', () => {
      setBackendStatus('connected');
    });

    socket.on('sensor_telemetry_update', (telemetry) => {
      if (telemetry && telemetry.rainfall_mm_hr !== undefined) {
        setRainfall(telemetry.rainfall_mm_hr);
      }
    });

    socket.on('alert_triggered', (alertDoc) => {
      setLogs(prev => [{ id: Date.now(), ...alertDoc }, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Sync Rainfall change to Backend MongoDB Endpoint
  const handleRainfallChange = (newVal) => {
    setRainfall(newVal);
    if (isLiveStreamActive && backendStatus === 'connected') {
      sendSensorTelemetry({
        stationId: 'ZONE-03-MAWSYNRAM',
        rainfall_mm_hr: newVal,
      });
    }
  };

  // Trigger web audio sound
  const playBeep = (freq = 880, duration = 300) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration / 1000);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration / 1000);
    } catch (e) {
      console.log('Web audio unavailable');
    }
  };

  // Add Log Entry when Risk Band changes
  useEffect(() => {
    if (prevBandRef.current !== riskBand) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).toLowerCase();

      let logText = '';
      let logType = 'info';

      if (riskBand === 'Low') {
        logText = 'Rainfall subsided. Risk band returned to Low.';
        logType = 'success';
      } else if (riskBand === 'Moderate') {
        logText = 'Soil saturation elevated. Risk band changed to Moderate.';
        logType = 'warning';
        playBeep(600, 250);
      } else if (riskBand === 'High') {
        logText = 'Risk escalated to High — field teams notified.';
        logType = 'orange';
        playBeep(880, 400);
      } else if (riskBand === 'Critical') {
        logText = 'CRITICAL ALERT: Slope displacement threshold breached in Zone 3! Automated SMS & Siren dispatched.';
        logType = 'danger';
        playBeep(1200, 600);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }

      const alertPayload = { time: timeStr, text: logText, type: logType, riskScore };
      setLogs(prev => [{ id: Date.now(), ...alertPayload }, ...prev]);

      // Save alert to MongoDB via Backend API
      postAlertLog(alertPayload);

      prevBandRef.current = riskBand;
    }
  }, [riskBand]);

  return (
    <section id="live-dashboard" style={{ paddingTop: '5.5rem', paddingBottom: '5.5rem', position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 2.5rem auto' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>
            <span className="green-dot" />
            Interactive demo
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
            Simulate rising rainfall and watch the risk model respond
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.6 }}>
            This is a working simulation connected to the Node.js ingestion backend and MongoDB database. Move the slider to stream sensor data to the server!
          </p>

          {/* Backend Connection Status Badge */}
          <div
            className="font-mono"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              backgroundColor: backendStatus === 'connected' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)',
              border: backendStatus === 'connected' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(234, 179, 8, 0.3)',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              marginTop: '1rem',
              color: backendStatus === 'connected' ? '#4ade80' : '#facc15',
            }}
          >
            <Server size={14} /> Backend Server: <strong>{backendStatus === 'connected' ? 'Online (Port 3000)' : 'Offline Simulator'}</strong>
            <span style={{ color: '#64748b' }}>|</span>
            <Database size={14} /> MongoDB: <strong>{mongoStatus}</strong>
          </div>
        </div>

        {/* Dashboard 3 Panels Side-By-Side */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
            alignItems: 'stretch',
          }}
        >
          {/* PANEL 1: CONDITIONS */}
          <div className="card-dark" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  marginBottom: '1.5rem',
                }}
              >
                <div className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em', color: '#4ade80' }}>
                  PANEL 1 · CONDITIONS
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CloudRain size={18} color="#38bdf8" />
                </div>
              </div>

              {/* Slider for Rainfall Intensity */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f1f5f9' }}>Rainfall intensity</label>
                  <span className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>
                    {rainfall} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#94a3b8' }}>mm/hr</span>
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="140"
                  value={rainfall}
                  onChange={(e) => handleRainfallChange(Number(e.target.value))}
                />

                <div className="font-mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '0.4rem' }}>
                  <span>0 mm/hr (Dry)</span>
                  <span>70 mm/hr (Heavy)</span>
                  <span>140 mm/hr (Torrential)</span>
                </div>
              </div>

              {/* Preset Weather Scenario Buttons */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.6rem', fontWeight: 500 }}>
                  Quick weather presets:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  <button
                    onClick={() => handleRainfallChange(15)}
                    className="font-mono"
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      backgroundColor: rainfall === 15 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      color: rainfall === 15 ? '#4ade80' : '#cbd5e1',
                      border: rainfall === 15 ? '1px solid #22c55e' : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                    }}
                  >
                    Clear Sky (15)
                  </button>
                  <button
                    onClick={() => handleRainfallChange(48)}
                    className="font-mono"
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      backgroundColor: rainfall === 48 ? 'rgba(234, 179, 8, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      color: rainfall === 48 ? '#facc15' : '#cbd5e1',
                      border: rainfall === 48 ? '1px solid #eab308' : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                    }}
                  >
                    Monsoon (48)
                  </button>
                  <button
                    onClick={() => handleRainfallChange(82)}
                    className="font-mono"
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      backgroundColor: rainfall === 82 ? 'rgba(249, 115, 22, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      color: rainfall === 82 ? '#fb923c' : '#cbd5e1',
                      border: rainfall === 82 ? '1px solid #f97316' : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                    }}
                  >
                    Downpour (82)
                  </button>
                  <button
                    onClick={() => handleRainfallChange(125)}
                    className="font-mono"
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      backgroundColor: rainfall === 125 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      color: rainfall === 125 ? '#f87171' : '#cbd5e1',
                      border: rainfall === 125 ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                    }}
                  >
                    Cloudburst (125)
                  </button>
                </div>
              </div>

              {/* Rows: Soil moisture, Slope tilt, Model confidence */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 0.9rem',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.025)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
                    <Droplets size={16} color="#60a5fa" /> Soil moisture (%)
                  </div>
                  <span className="font-mono" style={{ fontWeight: 700, color: '#f1f5f9' }}>
                    {soilMoisture} %
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 0.9rem',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.025)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
                    <Compass size={16} color="#fbbf24" /> Slope tilt (°)
                  </div>
                  <span className="font-mono" style={{ fontWeight: 700, color: '#f1f5f9' }}>
                    {slopeTilt}°
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 0.9rem',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.025)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
                    <ShieldCheck size={16} color="#4ade80" /> Model confidence (%)
                  </div>
                  <span className="font-mono" style={{ fontWeight: 700, color: '#f1f5f9' }}>
                    {modelConfidence} %
                  </span>
                </div>
              </div>
            </div>

            <div className="font-mono" style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '1.5rem', fontStyle: 'italic' }}>
              * Data syncs with MongoDB collection 'telemetries' on every slider change.
            </div>
          </div>

          {/* PANEL 2: COMPOSITE RISK SCORE */}
          <div className="card-dark" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  marginBottom: '1.25rem',
                }}
              >
                <div className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em', color: '#4ade80' }}>
                  PANEL 2 · COMPOSITE RISK SCORE
                </div>
                
                {/* View Switcher: Cards vs GIS Map */}
                <div style={{ display: 'flex', gap: '0.3rem', backgroundColor: 'rgba(0,0,0,0.3)', padding: '2px', borderRadius: '8px' }}>
                  <button
                    onClick={() => setActiveTab('zones')}
                    title="Grid view"
                    style={{
                      padding: '0.2rem 0.5rem',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: activeTab === 'zones' ? '#1e3a29' : 'transparent',
                      color: activeTab === 'zones' ? '#4ade80' : '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Layers size={14} />
                  </button>
                  <button
                    onClick={() => setActiveTab('map')}
                    title="GIS Map view"
                    style={{
                      padding: '0.2rem 0.5rem',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: activeTab === 'map' ? '#1e3a29' : 'transparent',
                      color: activeTab === 'map' ? '#4ade80' : '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Map size={14} />
                  </button>
                </div>
              </div>

              {/* Semicircle Gauge with Needle */}
              <div style={{ position: 'relative', textAlign: 'center', margin: '0.5rem 0 1.25rem 0' }}>
                <svg width="220" height="120" viewBox="0 0 200 110" style={{ overflow: 'visible', margin: '0 auto' }}>
                  <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="16" strokeLinecap="round" />
                  <path d="M 20 100 A 80 80 0 0 1 67.5 35.2" fill="none" stroke="#22c55e" strokeWidth="16" strokeLinecap="round" opacity="0.85" />
                  <path d="M 67.5 35.2 A 80 80 0 0 1 113.8 24" fill="none" stroke="#eab308" strokeWidth="16" opacity="0.85" />
                  <path d="M 113.8 24 A 80 80 0 0 1 156.4 43.4" fill="none" stroke="#f97316" strokeWidth="16" opacity="0.85" />
                  <path d="M 156.4 43.4 A 80 80 0 0 1 180 100" fill="none" stroke="#ef4444" strokeWidth="16" strokeLinecap="round" opacity="0.85" />

                  {/* Needle */}
                  {(() => {
                    const angle = -180 + (riskScore / 100) * 180;
                    const rad = (angle * Math.PI) / 180;
                    const nx = 100 + 62 * Math.cos(rad);
                    const ny = 100 + 62 * Math.sin(rad);
                    return (
                      <g>
                        <line x1="100" y1="100" x2={nx} y2={ny} stroke={needleColor} strokeWidth="3.5" strokeLinecap="round" style={{ transition: 'all 0.4s ease' }} />
                        <circle cx="100" cy="100" r="7" fill={needleColor} stroke="#060c08" strokeWidth="2" />
                      </g>
                    );
                  })()}
                </svg>

                {/* Score Number Display */}
                <div style={{ marginTop: '-0.75rem' }}>
                  <span className="font-mono" style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>
                    {riskScore}
                  </span>
                  <span className="font-mono" style={{ fontSize: '1rem', color: '#64748b', fontWeight: 600 }}> / 100</span>
                </div>

                {/* Risk Band Badge Below Gauge */}
                <div style={{ marginTop: '0.4rem' }}>
                  <span className={`badge ${riskBadgeClass}`} style={{ fontSize: '0.85rem', padding: '0.3rem 0.9rem' }}>
                    {riskBand} Risk
                  </span>
                </div>
              </div>

              {/* MONITORING ZONES Section */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span className="font-mono" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em' }}>
                    MONITORING ZONES (6 SECTORS)
                  </span>
                  <span className="font-mono" style={{ fontSize: '0.72rem', color: '#22c55e' }}>
                    Updated live
                  </span>
                </div>

                {activeTab === 'zones' ? (
                  /* 3x2 Grid of Small Cards */
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem' }}>
                    {processedZones.map((z) => (
                      <div
                        key={z.id}
                        style={{
                          padding: '0.55rem 0.75rem',
                          borderRadius: '8px',
                          backgroundColor: z.id === 3 ? 'rgba(239, 68, 68, 0.08)' : 'rgba(255, 255, 255, 0.025)',
                          border: z.id === 3 ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid rgba(255, 255, 255, 0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', overflow: 'hidden' }}>
                          <span
                            style={{
                              width: '7px',
                              height: '7px',
                              borderRadius: '50%',
                              backgroundColor: z.color,
                              boxShadow: `0 0 6px ${z.color}`,
                              flexShrink: 0,
                            }}
                          />
                          <span style={{ fontSize: '0.8rem', fontWeight: z.id === 3 ? 700 : 500, color: z.id === 3 ? '#f8fafc' : '#cbd5e1', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {z.name}
                          </span>
                        </div>
                        <span className="font-mono" style={{ fontSize: '0.8rem', fontWeight: 700, color: z.color }}>
                          {z.score}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* SVG GIS Interactive Map Visualization */
                  <div
                    style={{
                      height: '150px',
                      borderRadius: '10px',
                      backgroundColor: '#0a140d',
                      border: '1px solid rgba(34, 197, 94, 0.2)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <svg width="100%" height="100%" style={{ opacity: 0.25 }}>
                      <path d="M 10 30 Q 80 10 160 50 T 300 40" fill="none" stroke="#22c55e" strokeWidth="1" />
                      <path d="M 20 80 Q 100 120 220 70 T 320 110" fill="none" stroke="#22c55e" strokeWidth="1" />
                    </svg>

                    {processedZones.map((z) => (
                      <div
                        key={z.id}
                        title={`${z.name}: ${z.score} (${z.band})`}
                        style={{
                          position: 'absolute',
                          left: `${z.x}%`,
                          top: `${z.y}%`,
                          transform: 'translate(-50%, -50%)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        <div
                          style={{
                            width: z.id === 3 ? '14px' : '10px',
                            height: z.id === 3 ? '14px' : '10px',
                            borderRadius: '50%',
                            backgroundColor: z.color,
                            boxShadow: `0 0 10px ${z.color}`,
                            border: '2px solid #060c08',
                          }}
                        />
                        <span
                          className="font-mono"
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            color: '#ffffff',
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            padding: '1px 4px',
                            borderRadius: '3px',
                            marginTop: '2px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {z.name.split('·')[1].trim()} ({z.score})
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* PANEL 3: ALERT LOG */}
          <div className="card-dark" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  marginBottom: '1.25rem',
                }}
              >
                <div className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em', color: '#4ade80' }}>
                  PANEL 3 · ALERT LOG
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    title={soundEnabled ? 'Disable alert audio chime' : 'Enable alert audio chime'}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: soundEnabled ? '#22c55e' : '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  </button>
                  <BellRing size={16} color="#f97316" />
                </div>
              </div>

              {/* Scrollable list of timestamped log entries */}
              <div
                style={{
                  height: '240px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  paddingRight: '0.4rem',
                }}
              >
                {logs.map((log, index) => {
                  let borderColor = 'rgba(255, 255, 255, 0.06)';
                  let textColor = '#cbd5e1';

                  if (log.type === 'danger') {
                    borderColor = 'rgba(239, 68, 68, 0.35)';
                    textColor = '#f87171';
                  } else if (log.type === 'orange') {
                    borderColor = 'rgba(249, 115, 22, 0.35)';
                    textColor = '#fb923c';
                  } else if (log.type === 'warning') {
                    borderColor = 'rgba(234, 179, 8, 0.35)';
                    textColor = '#facc15';
                  } else if (log.type === 'success') {
                    borderColor = 'rgba(34, 197, 94, 0.35)';
                    textColor = '#4ade80';
                  }

                  return (
                    <div
                      key={log.id || index}
                      style={{
                        padding: '0.65rem 0.75rem',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        borderLeft: `3px solid ${log.type === 'danger' ? '#ef4444' : log.type === 'orange' ? '#f97316' : log.type === 'warning' ? '#eab308' : '#22c55e'}`,
                        borderTop: '1px solid ' + borderColor,
                        borderRight: '1px solid ' + borderColor,
                        borderBottom: '1px solid ' + borderColor,
                      }}
                    >
                      <div className="font-mono" style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.2rem' }}>
                        {log.time}
                      </div>
                      <div style={{ fontSize: '0.83rem', color: textColor, lineHeight: 1.4 }}>
                        {log.text}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Alert Action Button */}
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <button
                onClick={() => setIsAlertModalOpen(true)}
                className="btn-outline font-mono"
                style={{
                  width: '100%',
                  fontSize: '0.82rem',
                  padding: '0.6rem 1rem',
                  justifyContent: 'center',
                  backgroundColor: riskScore >= 60 ? 'rgba(249, 115, 22, 0.12)' : 'rgba(34, 197, 94, 0.06)',
                  borderColor: riskScore >= 60 ? 'rgba(249, 115, 22, 0.3)' : 'rgba(34, 197, 94, 0.2)',
                  color: riskScore >= 60 ? '#fb923c' : '#4ade80',
                }}
              >
                <Send size={14} /> Preview Alert Broadcast (SMS & Siren)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Dispatch Modal */}
      {isAlertModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            className="card-dark"
            style={{
              maxWidth: '480px',
              width: '100%',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#22c55e', fontWeight: 700 }}>
                <AlertCircle size={20} /> TerraShift Early Warning Dispatch
              </div>
              <button
                onClick={() => setIsAlertModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>

            <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Automated multi-channel alert protocol active. When risk score exceeds safety thresholds, warnings are pushed in under 2 seconds:
            </div>

            <div
              className="font-mono"
              style={{
                backgroundColor: '#070f09',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                fontSize: '0.8rem',
                color: '#4ade80',
                marginBottom: '1.5rem',
                lineHeight: 1.6,
              }}
            >
              <div><strong>[SMS Broadcast]:</strong> ALARM: Zone 3 (Mawsynram) Landslide Risk at {riskScore}%. Move to higher ground immediately! Emergency Control: 1070</div>
              <div style={{ marginTop: '0.6rem', color: '#94a3b8' }}><strong>[Distress Band]:</strong> 433 MHz LoRa Radio Alert Sent to Village Headmen</div>
            </div>

            <button
              onClick={() => setIsAlertModalOpen(false)}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
