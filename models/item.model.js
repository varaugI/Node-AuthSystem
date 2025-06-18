const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  customId: String,  // <- your custom "1", "2", etc.
  title: String,
  summary: String,
  description: String,
  image: String
});

module.exports = mongoose.model('Item', itemSchema);
