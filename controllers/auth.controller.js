const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { generateOTP } = require('../utils/otp.util');
const Token = require('../models/token.model');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/token.util');

// Sign up
exports.signup = async (req, res) => {
    try {

        const { username, email = "", phone = "", password, gender, accountType } = req.body;

        if (!username || (!email.trim() && !phone.trim()) || !password)
            return res.status(400).json({ msg: 'Required fields missing' });

        const existingUsername = await User.findOne({ username });
        if (existingUsername) return res.status(409).json({ msg: 'Username already taken' });

        if (email.trim()) {
            const existingEmail = await User.findOne({ email: email.trim() });
            if (existingEmail) return res.status(409).json({ msg: 'Email already registered' });
        }

        if (phone.trim()) {
            const existingPhone = await User.findOne({ phone: phone.trim() });
            if (existingPhone) return res.status(409).json({ msg: 'Phone already registered' });
        }


        const existingUser = await User.findOne({
            $or: [{ username }, { email }, { phone }]
        });

        if (existingUser) return res.status(409).json({ msg: 'User already exists' });

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            phone,
            passwordHash,
            gender,
            accountType
        });

        await newUser.save();

        res.status(201).json({ msg: 'User created' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

// Login with password
exports.login = async (req, res) => {
    try {
        const identifier = (req.body.identifier || "").trim();
        const password = req.body.password;

        if (!identifier || !password)
            return res.status(400).json({ msg: 'Identifier and password are required' });

        const user = await User.findOne({
            $or: [
                { username: identifier },
                { email: identifier },
                { phone: identifier }
            ]
        });

        if (!user) return res.status(404).json({ msg: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(401).json({ msg: 'Incorrect password' });

        await issueTokens(user.userId, res);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};


// Send OTP
exports.sendOtp = async (req, res) => {
    try {
        const { identifier } = req.body;

        const user = await User.findOne({
            $or: [{ username: identifier }, { email: identifier }, { phone: identifier }]
        });

        if (!user) return res.status(404).json({ msg: 'User not found' });

        const otp = generateOTP();
        const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min

        user.otp = otp;
        user.otpExpiry = expiry;
        await user.save();

        // For now, just return OTP (in real life, send via SMS/email)
        res.json({ msg: 'OTP sent', otp });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
    try {
        const { identifier, otp } = req.body;

        const user = await User.findOne({
            $or: [{ username: identifier }, { email: identifier }, { phone: identifier }]
        });

        if (!user || user.otp !== otp || user.otpExpiry < Date.now())
            return res.status(401).json({ msg: 'Invalid or expired OTP' });

        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        await issueTokens(user.userId, res); // ✅ fixed
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};




// At login or OTP verify
const issueTokens = async (userId, res) => {
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    await Token.create({
        userId,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ accessToken });
};



// Refresh route
exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json({ msg: 'Refresh token missing' });

        const storedToken = await Token.findOne({ refreshToken });
        if (!storedToken || storedToken.expiresAt < Date.now())
            return res.status(403).json({ msg: 'Invalid or expired refresh token' });

        const decoded = verifyRefreshToken(refreshToken);
        const newAccessToken = generateAccessToken(decoded.userId);

        res.json({ accessToken: newAccessToken });
    } catch (err) {
        res.status(403).json({ msg: 'Invalid refresh token', error: err.message });
    }
};

// Logout route
exports.logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            await Token.deleteOne({ refreshToken });
            res.clearCookie('refreshToken');
        }
        res.json({ msg: 'Logged out' });
    } catch (err) {
        res.status(500).json({ msg: 'Logout failed', error: err.message });
    }
};


exports.resetPassword = async (req, res) => {
  try {
    const { identifier, otp, newPassword } = req.body;

    if (!identifier || !otp || !newPassword) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }, { phone: identifier }]
    });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (!user.otp || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(401).json({ msg: 'Invalid or expired OTP' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = passwordHash;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};