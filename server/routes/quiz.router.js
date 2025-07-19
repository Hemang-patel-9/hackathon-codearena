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

// Get all user quizzes (created + participated)
router.get('/allQuiz/:id', quizController.getUserQuizzes);
router.get('/upcoming/:id', quizController.getUpcomingQuizzes)
router.get('/publicQuiz/all', quizController.getPublicQuizzes)
router.route('/quiz/:id').get(quizController.getAccessibleQuizzesByUser)

router.route('/checkpassword').post(quizController.checkPasswordProtectedQuizAccess)

module.exports = router;