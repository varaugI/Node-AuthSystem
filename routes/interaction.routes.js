const router = require('express').Router();
const interactionController = require('../controllers/interaction.controller');

router.post('/like', interactionController.likeItem);
router.post('/bookmark', interactionController.bookmarkItem);
router.post('/comment', interactionController.addComment);
router.post('/report', interactionController.reportItem);
router.post('/mute', interactionController.muteUser);
router.post('/block', interactionController.blockUser);

module.exports = router;
