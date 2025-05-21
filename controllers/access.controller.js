const Asset = require('../models/asset.model');

// Assign access to asset
exports.assignAssetAccess = async (req, res) => {
  try {
    const { assetId, targetUserId, accessLevel } = req.body;
    const requestingUserId = req.user.userId;

    const asset = await Asset.findOne({ assetId });
    if (!asset) return res.status(404).json({ msg: 'Asset not found' });

    if (asset.ownerUserId !== requestingUserId)
      return res.status(403).json({ msg: 'Not asset owner' });

    const exists = asset.access.find(a => a.userId === targetUserId);
    if (exists) exists.accessLevel = accessLevel;
    else asset.access.push({ userId: targetUserId, accessLevel });

    await asset.save();
    res.json({ msg: 'Access assigned' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get asset if authorized
exports.getAssetIfAuthorized = async (req, res) => {
  try {
    const assetId = req.params.id;
    const userId = req.user.userId;

    const asset = await Asset.findOne({ assetId });
    if (!asset) return res.status(404).json({ msg: 'Asset not found' });

    const isOwner = asset.ownerUserId === userId;
    const hasAccess = asset.access.find(a => a.userId === userId);

    if (!isOwner && !hasAccess)
      return res.status(403).json({ msg: 'Access denied to asset' });

    res.json({ asset });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
