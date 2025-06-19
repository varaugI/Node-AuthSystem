const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: String,
  date: Date
});

const interactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  liked: Boolean,
  bookmarked: Boolean,
  comments: [commentSchema],
  reported: Boolean,
  reportReason: String,
  mutedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Interaction', interactionSchema);