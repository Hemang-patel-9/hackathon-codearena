const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');

// Base route for /api/quizzes
router.route('/')
    .post(quizController.createQuiz)
    .get(quizController.getAllQuizzes);

// Route for /api/quizzes/:id
router.route('/:id')
    .get(quizController.getQuizById)
    .put(quizController.updateQuiz)
    .delete(quizController.deleteQuiz);

module.exports = router;