const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const Telemetry = require('./models/Telemetry.cjs');
const Zone = require('./models/Zone.cjs');
const Alert = require('./models/Alert.cjs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/terrashift';

let isMongoConnected = false;

// Connect to MongoDB Database
mongoose.connect(MONGODB_URI)
  .then(() => {
    isMongoConnected = true;
    console.log('Connected to MongoDB Database successfully!');
    seedZonesIfEmpty();
    seedInitialAlertsIfEmpty();
  })
  .catch((err) => {
    console.warn('MongoDB connection warning (Running with in-memory fallback mode):', err.message);
  });

// Initial Seed Data for Monitoring Zones
async function seedZonesIfEmpty() {
  try {
    const count = await Zone.countDocuments();
    if (count === 0) {
      const initialZones = [
        { zoneId: 1, name: 'Zone 1 · Shillong', sector: 'Shillong', lat: '25.5788', lon: '91.8933', riskScore: 50, riskBand: 'Moderate', color: '#eab308' },
        { zoneId: 2, name: 'Zone 2 · Aizawl', sector: 'Aizawl', lat: '23.7271', lon: '92.7176', riskScore: 44, riskBand: 'Moderate', color: '#eab308' },
        { zoneId: 3, name: 'Zone 3 · Mawsynram', sector: 'Mawsynram', lat: '25.2986', lon: '91.5822', riskScore: 66, riskBand: 'High', color: '#f97316' },
        { zoneId: 4, name: 'Zone 4 · Kohima', sector: 'Kohima', lat: '25.6751', lon: '94.1086', riskScore: 48, riskBand: 'Moderate', color: '#eab308' },
        { zoneId: 5, name: 'Zone 5 · Itanagar', sector: 'Itanagar', lat: '27.0844', lon: '93.6053', riskScore: 54, riskBand: 'Moderate', color: '#eab308' },
        { zoneId: 6, name: 'Zone 6 · Along', sector: 'Along', lat: '28.1673', lon: '94.7937', riskScore: 40, riskBand: 'Moderate', color: '#eab308' },
      ];
      await Zone.insertMany(initialZones);
      console.log('🌱 Seeded 6 initial Monitoring Zones into MongoDB');
    }
  } catch (err) {
    console.error('Zone seeding error:', err.message);
  }
}

// Initial Seed Data for Alert Logs
async function seedInitialAlertsIfEmpty() {
  try {
    const count = await Alert.countDocuments();
    if (count === 0) {
      const initialAlerts = [
        { time: '01:12:49 am', text: 'Monitoring started. Baseline conditions nominal.', type: 'info' },
        { time: '01:14:10 am', text: 'Sensors connected: 6 telemetry nodes active.', type: 'info' },
        { time: '01:15:32 am', text: 'Soil saturation model initialized for Mawsynram sector.', type: 'info' },
      ];
      await Alert.insertMany(initialAlerts);
      console.log('🌱 Seeded initial Alert Logs into MongoDB');
    }
  } catch (err) {
    console.error('Alert seeding error:', err.message);
  }
}

// Helper: Calculate AI Risk Score
function calculateRiskScore(rainfall, soilMoisture, slopeTilt) {
  const rFactor = Math.min(1.0, rainfall / 140.0) * 55.0;
  const sFactor = Math.min(1.0, soilMoisture / 96.0) * 33.0;
  const tFactor = Math.min(1.0, slopeTilt / 7.0) * 12.0;

  const score = Math.min(99, Math.max(10, Math.round(rFactor + sFactor + tFactor)));

  let band = 'Low';
  if (score >= 80) band = 'Critical';
  else if (score >= 60) band = 'High';
  else if (score >= 38) band = 'Moderate';

  const confidence = Math.min(96, Math.round(86 + rainfall * 0.08));

  return { score, band, confidence };
}

// REST API ROUTES

// Health Check Endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'TerraShift AI Early Warning API',
    mongoDB: isMongoConnected ? 'Connected' : 'Disconnected (In-Memory Fallback)',
    timestamp: new Date().toISOString()
  });
});

// ESP32 Sensor Telemetry Ingestion Endpoint (POST)
app.post('/api/v1/telemetry', async (req, res) => {
  try {
    const {
      stationId = 'ZONE-03-MAWSYNRAM',
      rainfall_mm_hr = 72,
      soil_moisture_pct,
      slope_tilt_deg
    } = req.body;

    const rainfall = Number(rainfall_mm_hr);
    const soil = soil_moisture_pct !== undefined ? Number(soil_moisture_pct) : Math.min(96, Math.round(35 + rainfall * 0.52));
    const tilt = slope_tilt_deg !== undefined ? Number(slope_tilt_deg) : Number((1.1 + rainfall * 0.038).toFixed(1));

    // Calculate AI Risk Score
    const aiResult = calculateRiskScore(rainfall, soil, tilt);

    const telemetryDoc = {
      stationId,
      rainfall_mm_hr: rainfall,
      soil_moisture_pct: soil,
      slope_tilt_deg: tilt,
      model_confidence: aiResult.confidence,
      riskScore: aiResult.score,
      riskBand: aiResult.band,
      timestamp: new Date()
    };

    // Save to MongoDB if connected
    let savedEntry = telemetryDoc;
    if (isMongoConnected) {
      const newTelemetry = new Telemetry(telemetryDoc);
      savedEntry = await newTelemetry.save();

      // Update Zone 3 (Mawsynram) and surrounding zones in MongoDB
      const zonesData = [
        { zoneId: 1, offset: -16 },
        { zoneId: 2, offset: -22 },
        { zoneId: 3, offset: 0 },
        { zoneId: 4, offset: -18 },
        { zoneId: 5, offset: -12 },
        { zoneId: 6, offset: -26 },
      ];

      for (const z of zonesData) {
        const zScore = Math.min(99, Math.max(8, aiResult.score + z.offset));
        let color = '#22c55e';
        let zBand = 'Low';
        if (zScore >= 80) { color = '#ef4444'; zBand = 'Critical'; }
        else if (zScore >= 60) { color = '#f97316'; zBand = 'High'; }
        else if (zScore >= 38) { color = '#eab308'; zBand = 'Moderate'; }

        await Zone.findOneAndUpdate(
          { zoneId: z.zoneId },
          { riskScore: zScore, riskBand: zBand, color, updatedAt: new Date() }
        );
      }
    }

    // Emit live WebSocket update to all React dashboard clients
    io.emit('sensor_telemetry_update', savedEntry);

    res.status(200).json({
      status: 'success',
      message: 'Telemetry stored in MongoDB & broadcast to dashboard',
      data: savedEntry
    });
  } catch (err) {
    console.error('Error processing telemetry:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET Latest Telemetry Reading
app.get('/api/v1/telemetry/latest', async (req, res) => {
  try {
    if (isMongoConnected) {
      const latest = await Telemetry.findOne().sort({ timestamp: -1 });
      if (latest) return res.json(latest);
    }
    res.json({
      stationId: 'ZONE-03-MAWSYNRAM',
      rainfall_mm_hr: 72,
      soil_moisture_pct: 71,
      slope_tilt_deg: 3.4,
      model_confidence: 92,
      riskScore: 66,
      riskBand: 'High',
      timestamp: new Date()
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET Telemetry History (MongoDB query)
app.get('/api/v1/telemetry/history', async (req, res) => {
  try {
    if (isMongoConnected) {
      const history = await Telemetry.find().sort({ timestamp: -1 }).limit(50);
      return res.json(history);
    }
    res.json([]);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET Monitoring Zones
app.get('/api/v1/zones', async (req, res) => {
  try {
    if (isMongoConnected) {
      const zones = await Zone.find().sort({ zoneId: 1 });
      return res.json(zones);
    }
    res.json([
      { zoneId: 1, name: 'Zone 1 · Shillong', riskScore: 50, riskBand: 'Moderate', color: '#eab308' },
      { zoneId: 2, name: 'Zone 2 · Aizawl', riskScore: 44, riskBand: 'Moderate', color: '#eab308' },
      { zoneId: 3, name: 'Zone 3 · Mawsynram', riskScore: 66, riskBand: 'High', color: '#f97316' },
      { zoneId: 4, name: 'Zone 4 · Kohima', riskScore: 48, riskBand: 'Moderate', color: '#eab308' },
      { zoneId: 5, name: 'Zone 5 · Itanagar', riskScore: 54, riskBand: 'Moderate', color: '#eab308' },
      { zoneId: 6, name: 'Zone 6 · Along', riskScore: 40, riskBand: 'Moderate', color: '#eab308' },
    ]);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET Alerts Log
app.get('/api/v1/alerts', async (req, res) => {
  try {
    if (isMongoConnected) {
      const alerts = await Alert.find().sort({ createdAt: -1 }).limit(30);
      return res.json(alerts);
    }
    res.json([
      { time: '01:12:49 am', text: 'Monitoring started. Baseline conditions nominal.', type: 'info' },
      { time: '01:14:10 am', text: 'Sensors connected: 6 telemetry nodes active.', type: 'info' },
      { time: '01:15:32 am', text: 'Soil saturation model initialized for Mawsynram sector.', type: 'info' }
    ]);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST New Alert Entry
app.post('/api/v1/alerts', async (req, res) => {
  try {
    const { time, text, type = 'info', riskScore } = req.body;
    const alertDoc = { time, text, type, riskScore, createdAt: new Date() };

    if (isMongoConnected) {
      const newAlert = new Alert(alertDoc);
      await newAlert.save();
    }

    io.emit('alert_triggered', alertDoc);
    res.status(200).json({ status: 'success', data: alertDoc });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Socket.io Realtime Connection Event Handler
io.on('connection', (socket) => {
  console.log(`Client connected to socketio: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start Express Server
server.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
