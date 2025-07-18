// routes/quizGenerationRoutes.js
const express = require('express');
const router = express.Router();
const quizGenerationController = require('../controllers/generator.controller'); // Adjust path

// Define the route for generating quiz questions
router.post('/generate', quizGenerationController.generateQuizQuestions);

module.exports = router;