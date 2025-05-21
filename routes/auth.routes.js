const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');

router.post('/signup', authCtrl.signup);
router.post('/login', authCtrl.login);
router.post('/verify-otp', authCtrl.verifyOtp);
router.post('/send-otp', authCtrl.sendOtp);
router.post('/refresh', authCtrl.refreshToken);
router.post('/logout', authCtrl.logout);

module.exports = router;
