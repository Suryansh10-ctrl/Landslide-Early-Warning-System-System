const mongoose = require('mongoose');

const TelemetrySchema = new mongoose.Schema({
  stationId: {
    type: String,
    required: true,
    default: 'ZONE-03-MAWSYNRAM'
  },
  rainfall_mm_hr: {
    type: Number,
    required: true
  },
  soil_moisture_pct: {
    type: Number,
    required: true
  },
  slope_tilt_deg: {
    type: Number,
    required: true
  },
  model_confidence: {
    type: Number,
    default: 92
  },
  riskScore: {
    type: Number,
    required: true
  },
  riskBand: {
    type: String,
    enum: ['Low', 'Moderate', 'High', 'Critical'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Telemetry', TelemetrySchema);
