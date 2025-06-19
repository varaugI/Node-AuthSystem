const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  customId: String,
  title: String,
  summary: String,
  description: String,
  image: String,
  authorUserId: String,
  createdBy: {
  type: String,
  required: true
}

});

module.exports = mongoose.model('Item', itemSchema);
