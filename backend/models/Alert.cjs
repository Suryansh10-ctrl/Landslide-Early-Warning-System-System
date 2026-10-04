const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'orange', 'danger', 'success'],
    default: 'info'
  },
  stationId: {
    type: String,
    default: 'ZONE-03-MAWSYNRAM'
  },
  riskScore: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Alert', AlertSchema);
