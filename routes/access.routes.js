const express = require('express');
const router = express.Router();
const accessCtrl = require('../controllers/access.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/assign', authMiddleware, accessCtrl.assignAssetAccess);
router.get('/assets/:id', authMiddleware, accessCtrl.getAssetIfAuthorized);

module.exports = router;
