const express = require('express');
const { startReview, getReview, listReviewHistory } = require('../controllers/review.controller');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.post('/start', startReview);
router.get('/history', listReviewHistory);
router.get('/:id', getReview);

module.exports = router;
