const express = require('express');
const router = express.Router();
const Item = require('../models/item.model');

// Route: Get all items (summary data)
router.get('/', async (req, res) => {
    try {
        const items = await Item.find({}, 'id customId title image summary'); 
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Route: Get single item by ID (detailed data)
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findOne({ customId: req.params.id });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


module.exports = router;
