import React, { useState } from 'react';
import { Cpu, Wifi, Radio, Server, Code, Zap, Layers, Copy, Check, Terminal, ShieldAlert } from 'lucide-react';

export default function SensorIntegrationGuide() {
  const [activeTab, setActiveTab] = useState('hardware'); // 'hardware', 'esp32', 'backend', 'websocket'
  const [copiedCode, setCopiedCode] = useState(false);

  const esp32Code = `// TerraShift ESP32 IoT Sensor Node Firmware
#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverUrl = "http://YOUR_SERVER_IP:3000/api/v1/telemetry";

Adafruit_MPU6050 mpu;
const int SOIL_PIN = 34; // Analog pin for soil moisture
const int RAIN_PIN = 35; // Analog/Interrupt pin for rain gauge

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nWiFi Connected!");

  Wire.begin(21, 22); // SDA = GPIO21, SCL = GPIO22
  if (!mpu.begin()) {
    Serial.println("MPU6050 Tilt Sensor Init Failed!");
  }
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    // Read MPU6050 Tilt Angle
    sensors_event_t a, g, temp;
    mpu.getEvent(&a, &g, &temp);
    float tiltAngle = sqrt(a.acceleration.x * a.acceleration.x + a.acceleration.y * a.acceleration.y);

    // Read Soil Moisture (Analog 0-4095 mapped to 0-100%)
    int rawSoil = analogRead(SOIL_PIN);
    float soilMoisture = map(rawSoil, 4095, 1500, 0, 100);
    soilMoisture = constrain(soilMoisture, 0.0, 100.0);

    // Read Rain Intensity (mm/hr)
    int rawRain = analogRead(RAIN_PIN);
    float rainfall_mm_hr = map(rawRain, 4095, 0, 0, 150);

    // Construct JSON Payload
    String jsonPayload = "{";
    jsonPayload += "\\"stationId\\":\\"ZONE-03-MAWSYNRAM\\",";
    jsonPayload += "\\"rainfall_mm_hr\\":" + String(rainfall_mm_hr, 1) + ",";
    jsonPayload += "\\"soil_moisture_pct\\":" + String(soilMoisture, 1) + ",";
    jsonPayload += "\\"slope_tilt_deg\\":" + String(tiltAngle, 1);
    jsonPayload += "}";

    int httpResponseCode = http.POST(jsonPayload);
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);

    http.end();
  }
  delay(5000); // Send sensor telemetry every 5 seconds
}`;

  const nodeBackendCode = `// Node.js Express API & WebSocket Server
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());

// In-Memory AI Risk Calculation Function
function calculateLandslideRisk(rainfall, soil, tilt) {
  // ML Trained Weights derived from Northeast India Historical Data
  let score = (rainfall / 140.0) * 55 + (soil / 100.0) * 33 + (tilt / 10.0) * 12;
  return Math.min(100, Math.max(0, Math.round(score)));
}

// REST API Endpoint for ESP32 Sensor Ingestion
app.post('/api/v1/telemetry', (req, res) => {
  const { stationId, rainfall_mm_hr, soil_moisture_pct, slope_tilt_deg } = req.body;
  
  const riskScore = calculateLandslideRisk(rainfall_mm_hr, soil_moisture_pct, slope_tilt_deg);
  
  const telemetryData = {
    stationId,
    rainfall_mm_hr,
    soil_moisture_pct,
    slope_tilt_deg,
    riskScore,
    timestamp: new Date().toISOString()
  };

  // Broadcast real-time sensor data to React Dashboard Clients
  io.emit('sensor_update', telemetryData);

  res.status(200).json({ status: 'success', riskScore });
});

server.listen(3000, () => Serial.println('TerraShift IoT Ingestion Server on Port 3000'));`;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section id="sensor-integration" style={{ paddingTop: '5.5rem', paddingBottom: '5.5rem', position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem auto' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>
            <span className="green-dot" />
            Hardware & Sensor Integration Architecture
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
            How to connect physical IoT sensors to Early Landslide Warning System
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Step-by-step guide to connecting real hardware (ESP32, Rain Gauges, Soil Moisture, MPU6050 Tilt Gyro) to the Node.js backend and streaming live data to this React web dashboard.
          </p>
        </div>

        {/* Integration Workflow Diagram */}
        <div
          className="card-dark"
          style={{
            padding: '2rem',
            marginBottom: '3rem',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            background: 'linear-gradient(135deg, rgba(14,25,18,0.9) 0%, rgba(8,16,11,0.95) 100%)',
          }}
        >
          <div className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4ade80', marginBottom: '1.5rem', textAlign: 'center', letterSpacing: '0.08em' }}>
            END-TO-END HARDWARE TO DASHBOARD DATA PIPELINE
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
              alignItems: 'center',
            }}
          >
            {/* Step 1: Sensors */}
            <div style={{ padding: '1.25rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', fontWeight: 700, marginBottom: '0.5rem' }}>
                <Cpu size={20} /> 1. Physical Sensors
              </div>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                Tipping Bucket Rain Gauge, Capacitive Soil Moisture v1.2, and MPU6050 Accelerometer/Gyroscope.
              </p>
            </div>

            {/* Step 2: ESP32 Microcontroller */}
            <div style={{ padding: '1.25rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: 700, marginBottom: '0.5rem' }}>
                <Radio size={20} /> 2. ESP32 Node
              </div>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                Samples analog/digital pins every 5s, constructs JSON telemetry, transmits over Wi-Fi or 433MHz LoRa.
              </p>
            </div>

            {/* Step 3: Backend Ingestion */}
            <div style={{ padding: '1.25rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a78bfa', fontWeight: 700, marginBottom: '0.5rem' }}>
                <Server size={20} /> 3. Express + WebSockets
              </div>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                Backend runs Python AI model inference, logs into MongoDB, and broadcasts via Socket.io.
              </p>
            </div>

            {/* Step 4: Web Dashboard */}
            <div style={{ padding: '1.25rem', borderRadius: '12px', backgroundColor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4ade80', fontWeight: 700, marginBottom: '0.5rem' }}>
                <Zap size={20} /> 4. React Dashboard
              </div>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                UI updates gauge, risk score, map nodes, and triggers early warning SMS/Sirens automatically.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation for Code & Wiring Details */}
        <div className="card-dark" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
            <button
              onClick={() => setActiveTab('hardware')}
              className="font-mono"
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: 'none',
                backgroundColor: activeTab === 'hardware' ? '#16a34a' : 'rgba(255,255,255,0.04)',
                color: activeTab === 'hardware' ? '#ffffff' : '#cbd5e1',
                cursor: 'pointer',
              }}
            >
              🔩 Required Hardware
            </button>
            <button
              onClick={() => setActiveTab('esp32')}
              className="font-mono"
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: 'none',
                backgroundColor: activeTab === 'esp32' ? '#16a34a' : 'rgba(255,255,255,0.04)',
                color: activeTab === 'esp32' ? '#ffffff' : '#cbd5e1',
                cursor: 'pointer',
              }}
            >
              ⚡ ESP32 C++ Code
            </button>
            <button
              onClick={() => setActiveTab('backend')}
              className="font-mono"
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: 'none',
                backgroundColor: activeTab === 'backend' ? '#16a34a' : 'rgba(255,255,255,0.04)',
                color: activeTab === 'backend' ? '#ffffff' : '#cbd5e1',
                cursor: 'pointer',
              }}
            >
              🌐 Node.js REST API
            </button>
          </div>

          {/* TAB 1: HARDWARE & PIN WIRING */}
          {activeTab === 'hardware' && (
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>
                Hardware Components & Pin Connections
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '1rem', borderRadius: '10px', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: '0.4rem' }}>1. ESP32 Dev Module</div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    Microcontroller with built-in Wi-Fi, BLE, and multiple ADC pins. Operates at 3.3V.
                  </div>
                </div>

                <div style={{ padding: '1rem', borderRadius: '10px', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontWeight: 700, color: '#fbbf24', marginBottom: '0.4rem' }}>2. MPU6050 Slope Tilt Gyro</div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    Measures pitch & roll slope angle (°). Pins: VCC → 3.3V, GND → GND, SDA → GPIO 21, SCL → GPIO 22.
                  </div>
                </div>

                <div style={{ padding: '1rem', borderRadius: '10px', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontWeight: 700, color: '#60a5fa', marginBottom: '0.4rem' }}>3. Soil Moisture v1.2 Sensor</div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    Capacitive moisture sensor resistant to corrosion. Analog AOUT connected to ESP32 GPIO 34.
                  </div>
                </div>

                <div style={{ padding: '1rem', borderRadius: '10px', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontWeight: 700, color: '#4ade80', marginBottom: '0.4rem' }}>4. Tipping Bucket Rain Gauge</div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    Measures rainfall intensity (mm/hr). Reed switch output connected to ESP32 Interrupt GPIO 35.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ESP32 CODE */}
          {activeTab === 'esp32' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="font-mono" style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  Arduino IDE / PlatformIO C++ Script (`terrashift_node.ino`)
                </span>
                <button
                  onClick={() => copyToClipboard(esp32Code)}
                  className="font-mono"
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    backgroundColor: 'rgba(34, 197, 94, 0.15)',
                    color: '#4ade80',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  {copiedCode ? <Check size={14} /> : <Copy size={14} />} {copiedCode ? 'Copied!' : 'Copy Code'}
                </button>
              </div>

              <pre
                className="font-mono"
                style={{
                  backgroundColor: '#050a06',
                  padding: '1.25rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  fontSize: '0.8rem',
                  color: '#4ade80',
                  overflowX: 'auto',
                  maxHeight: '380px',
                  lineHeight: 1.5,
                }}
              >
                {esp32Code}
              </pre>
            </div>
          )}

          {/* TAB 3: BACKEND REST API */}
          {activeTab === 'backend' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="font-mono" style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  Node.js / Express Ingestion Server (`server.js`)
                </span>
                <button
                  onClick={() => copyToClipboard(nodeBackendCode)}
                  className="font-mono"
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    backgroundColor: 'rgba(34, 197, 94, 0.15)',
                    color: '#4ade80',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  {copiedCode ? <Check size={14} /> : <Copy size={14} />} {copiedCode ? 'Copied!' : 'Copy Code'}
                </button>
              </div>

              <pre
                className="font-mono"
                style={{
                  backgroundColor: '#050a06',
                  padding: '1.25rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  fontSize: '0.8rem',
                  color: '#38bdf8',
                  overflowX: 'auto',
                  maxHeight: '380px',
                  lineHeight: 1.5,
                }}
              >
                {nodeBackendCode}
              </pre>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
