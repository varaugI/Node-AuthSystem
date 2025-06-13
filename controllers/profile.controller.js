const User = require('../models/user.model');

// Edit Profile
exports.editProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updates = req.body;

    if (updates.userId) delete updates.userId; // Cannot change

    if (updates.username) {
      const exists = await User.findOne({ username: updates.username });
      if (exists && exists.userId !== userId)
        return res.status(409).json({ msg: 'Username already taken' });
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