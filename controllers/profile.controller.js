const User = require('../models/user.model');

// Edit Profile
exports.editProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Whitelist of fields user is allowed to update
    const allowedUpdates = ['username', 'gender', 'phone','email'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Optional: Check username availability
    if (updates.username) {
      const exists = await User.findOne({ username: updates.username });
      if (exists && exists.userId.toString() !== userId.toString()) {
        return res.status(409).json({ msg: 'Username already taken' });
      }
    }

    const updatedUser = await User.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true }
    ).select('-passwordHash -otp -otpExpiry');

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId }).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};