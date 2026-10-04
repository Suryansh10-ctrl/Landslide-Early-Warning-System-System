const mongoose = require('mongoose');

const ZoneSchema = new mongoose.Schema({
  zoneId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  sector: {
    type: String,
    required: true
  },
  lat: String,
  lon: String,
  riskScore: {
    type: Number,
    default: 20
  },
  riskBand: {
    type: String,
    default: 'Low'
  },
  color: {
    type: String,
    default: '#22c55e'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Zone', ZoneSchema);
