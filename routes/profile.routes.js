const express = require('express');
const router = express.Router();
const profileCtrl = require('../controllers/profile.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.put('/edit', authMiddleware, profileCtrl.editProfile);

module.exports = router;
