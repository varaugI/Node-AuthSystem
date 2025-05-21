const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  userId: String,
  refreshToken: String,
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }
});

module.exports = mongoose.model('Token', tokenSchema);
