const Interaction = require('../models/interaction.model');

exports.likeItem = async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    await Interaction.updateOne(
      { userId, itemId },
      { $set: { liked: true } },
      { upsert: true }
    );
    res.status(200).json({ message: 'Item liked.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.bookmarkItem = async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    await Interaction.updateOne(
      { userId, itemId },
      { $set: { bookmarked: true } },
      { upsert: true }
    );
    res.status(200).json({ message: 'Item bookmarked.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { userId, itemId, comment } = req.body;
    await Interaction.updateOne(
      { userId, itemId },
      { $push: { comments: { text: comment, date: new Date() } } },
      { upsert: true }
    );
    res.status(200).json({ message: 'Comment added.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.reportItem = async (req, res) => {
  try {
    const { userId, itemId, reason } = req.body;
    await Interaction.updateOne(
      { userId, itemId },
      { $set: { reported: true, reportReason: reason } },
      { upsert: true }
    );
    res.status(200).json({ message: 'Item reported.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.muteUser = async (req, res) => {
  try {
    const { userId, targetUserId } = req.body;
    await Interaction.updateOne(
      { userId, mutedUsers: { $ne: targetUserId } },
      { $push: { mutedUsers: targetUserId } },
      { upsert: true }
    );
    res.status(200).json({ message: 'User muted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const { userId, targetUserId } = req.body;
    await Interaction.updateOne(
      { userId, blockedUsers: { $ne: targetUserId } },
      { $push: { blockedUsers: targetUserId } },
      { upsert: true }
    );
    res.status(200).json({ message: 'User blocked.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


