const express = require('express');
const router = express.Router();
const scoreboardController = require('../controllers/score.controller');

// Base route for /api/scoreboards
router.route('/')
    .post(scoreboardController.createOrUpdateScoreboard);

// Route for /api/scoreboards/:quizId
router.route('/:quizId')
    .get(scoreboardController.getScoreboardByQuizId)
    .delete(scoreboardController.deleteScoreboard);   

// Route for /api/scoreboards/:quizId/participants/:userId
router.route('/:quizId/participants/:userId')
    .put(scoreboardController.updateParticipantScore); 

module.exports = router;