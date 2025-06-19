const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const authenticate = require('../middlewares/auth.middleware');

router.post('/', authenticate, postController.createPost);
router.get('/', authenticate, postController.getPosts);

module.exports = router;