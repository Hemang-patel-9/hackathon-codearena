const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question.controller');

// Base route for /api/questions
router.route('/')
    .post(questionController.createQuestion)
    .get(questionController.getAllQuestions);

// Route for /api/questions/:id
router.route('/:id')
    .get(questionController.getQuestionById)
    .put(questionController.updateQuestion)
    .delete(questionController.deleteQuestion);

module.exports = router;