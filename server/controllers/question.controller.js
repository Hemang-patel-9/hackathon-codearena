// controllers/questionController.js
const Question = require('../models/question.model'); // Adjust the path as per your project structure

// Helper function for validating options based on questionType
const validateOptions = (questionType, options) => {
    if (questionType === 'open-ended') {
        if (options && options.length > 0) {
            return { isValid: false, message: 'Open-ended questions should not have options.' };
        }
    } else if (questionType === 'true-false') {
        if (!options || options.length !== 2) {
            return { isValid: false, message: 'True-false questions must have exactly two options.' };
        }
        const correctCount = options.filter(opt => opt.isCorrect).length;
        if (correctCount !== 1) {
            return { isValid: false, message: 'True-false questions must have exactly one correct option.' };
        }
    } else if (questionType === 'multiple-choice') {
        if (!options || options.length < 2) {
            return { isValid: false, message: 'Multiple-choice questions must have at least two options.' };
        }
        const correctCount = options.filter(opt => opt.isCorrect).length;
        if (correctCount !== 1) {
            return { isValid: false, message: 'Multiple-choice questions must have exactly one correct option.' };
        }
    } else if (questionType === 'multiple-select') {
        if (!options || options.length < 2) {
            return { isValid: false, message: 'Multiple-select questions must have at least two options.' };
        }
        const correctCount = options.filter(opt => opt.isCorrect).length;
        if (correctCount < 1) {
            return { isValid: false, message: 'Multiple-select questions must have at least one correct option.' };
        }
    }

    // Basic validation for options text
    if (options && options.some(opt => typeof opt.text !== 'string' || opt.text.trim() === '')) {
        return { isValid: false, message: 'All options must have non-empty text.' };
    }
    return { isValid: true };
};

// @route   POST /api/questions
exports.createQuestion = async (req, res) => {
    try {
        const { questionText, questionType, options, multimedia } = req.body;

        if (!questionText || !questionType) {
            return res.status(400).json({ success: false, message: 'Question text and type are required.' });
        }

        const optionsValidation = validateOptions(questionType, options);
        if (!optionsValidation.isValid) {
            return res.status(400).json({ success: false, message: optionsValidation.message });
        }

        const newQuestion = new Question({
            questionText,
            questionType,
            options,
            multimedia
        });

        const savedQuestion = await newQuestion.save();
        res.status(201).json({ success: true, data: savedQuestion });
    } catch (error) {
        console.error('Error creating question:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @route   GET /api/questions
exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find({});
        res.status(200).json({ success: true, count: questions.length, data: questions });
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @route   GET /api/questions/:id
exports.getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({ success: false, message: 'Question not found' });
        }

        res.status(200).json({ success: true, data: question });
    } catch (error) {
        console.error('Error fetching question by ID:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'Invalid Question ID format' });
        }
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @route   PUT /api/questions/:id
exports.updateQuestion = async (req, res) => {
    try {
        const { questionText, questionType, options, multimedia } = req.body;

        const existingQuestion = await Question.findById(req.params.id);
        if (!existingQuestion) {
            return res.status(404).json({ success: false, message: 'Question not found' });
        }

        const typeForValidation = questionType || existingQuestion.questionType;
        const optionsForValidation = options || existingQuestion.options;

        const optionsValidation = validateOptions(typeForValidation, optionsForValidation);
        if (!optionsValidation.isValid) {
            return res.status(400).json({ success: false, message: optionsValidation.message });
        }

        const updateFields = {
            questionText,
            questionType,
            options,
            multimedia
        };

        Object.keys(updateFields).forEach(key => updateFields[key] === undefined && delete updateFields[key]);

        const updatedQuestion = await Question.findByIdAndUpdate(
            req.params.id,
            updateFields,
            { new: true, runValidators: true }
        );

        if (!updatedQuestion) {
            return res.status(404).json({ success: false, message: 'Question not found' });
        }

        res.status(200).json({ success: true, data: updatedQuestion });
    } catch (error) {
        console.error('Error updating question:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'Invalid Question ID format' });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @route   DELETE /api/questions/:id
exports.deleteQuestion = async (req, res) => {
    try {
        const deletedQuestion = await Question.findByIdAndDelete(req.params.id);

        if (!deletedQuestion) {
            return res.status(404).json({ success: false, message: 'Question not found' });
        }

        res.status(200).json({ success: true, message: 'Question deleted successfully', data: {} });
    } catch (error) {
        console.error('Error deleting question:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'Invalid Question ID format' });
        }
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};