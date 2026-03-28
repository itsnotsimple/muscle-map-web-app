const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authenticateToken = require('../utils/authMiddleware');

router.post('/chat', authenticateToken, chatController.handleChat);
router.get('/chat/status', authenticateToken, chatController.getChatStatus);

module.exports = router;
