const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  assetId: String,
  name: String,
  ownerUserId: String,
  access: [{
    userId: String,
    accessLevel: String // e.g., read, write, admin
  }]
});

module.exports = mongoose.model('Asset', assetSchema);
