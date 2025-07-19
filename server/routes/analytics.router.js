// routes/analytics.routes.js
const express = require('express');
const router = express.Router();
const { getQuizAnalytics, getUserAnalytics } = require('../controllers/analytics.controller');

router.get('/quizanalysis', getQuizAnalytics);
router.get('/useranalysis', getUserAnalytics);

module.exports = router;