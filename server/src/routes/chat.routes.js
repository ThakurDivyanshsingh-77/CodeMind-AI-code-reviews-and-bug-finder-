const express = require('express');
const { askAssistant, getHistory, askRag } = require('../controllers/chat.controller');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.post('/', askAssistant);
router.post('/rag', askRag);
router.get('/:reviewId', getHistory);

module.exports = router;
