const express = require('express');
const { downloadPdf, downloadJson, downloadHtml } = require('../controllers/report.controller');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.get('/pdf/:id', downloadPdf);
router.get('/json/:id', downloadJson);
router.get('/html/:id', downloadHtml);

module.exports = router;
