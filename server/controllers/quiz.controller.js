// controllers/quizController.js
const Quiz = require('../models/quiz.model');
const bcrypt = require('bcryptjs');
const Question = require('../models/question.model');
const mongoose = require('mongoose');

// @route   POST /api/quizzes
const createQuiz = async (req, res) => {
    try {
        let {
            creator,
            title,
            description,
            questions,
            NoOfQuestion,
            timePerQuestion,
            passingCriteria,
            questionOrder,
            visibility,
            password,
            status,
            duration,
            participants,
            thumbnail,
            tags,
            schedule
        } = req.body;

        if (!title || !creator) {
            return res.status(400).json({ error: "Data is missing", data: null, message: 'Title and creator are required.' });
        }

        if (!mongoose.Types.ObjectId.isValid(creator)) {
            return res.status(400).json({ error: "Invalid creator ID format.", data: null, message: 'Invalid creator ID format.' });
        }

        if (questions && questions.length > 0) {
            const insertedQuestions = await Question.insertMany(questions);
            questions = insertedQuestions.map(q => q._id);
        }

        if (visibility === 'password-protected') {
            if (!password) {
                return res.status(400).json({ error: "Password is required for password-protected quizzes.", data: null, message: 'Password is required for password-protected quizzes.' });
            }
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
        } else if (visibility !== 'password-protected' && password) {
            password = undefined;
        }

        const newQuiz = new Quiz({
            creator,
            title,
            description,
            questions,
            NoOfQuestion: NoOfQuestion !== undefined ? NoOfQuestion : 1,
            timePerQuestion,
            passingCriteria,
            questionOrder,
            visibility,
            password,
            status,
            duration,
            participants,
            thumbnail,
            tags,
            schedule
        });

        const savedQuiz = await newQuiz.save();
        const quizResponse = savedQuiz.toObject();
        delete quizResponse.password;

        res.status(201).json({ success: true, data: quizResponse });
    } catch (error) {
        console.error('Error creating quiz:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @route   GET /api/quizzes
const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({})
            .populate('creator', 'username email')
            .select('-password');

        res.status(200).json({ success: true, count: quizzes.length, data: quizzes });
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @route   GET /api/quizzes/:id
const getQuizById = async (req, res) => {
    try {
        const quizId = req.params.id;
        //populate qustions data, questions : ["questionId1", "questionId2"]
        const quiz = await Quiz.findById(quizId)
            .populate('creator', 'username email')
            .populate({
                path: 'questions',
                model: 'Question'
            });

        res.status(200).json({ success: true, data: quiz });
    } catch (error) {
        console.error('Error fetching quiz by ID:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'Invalid Quiz ID format' });
        }
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @route   PUT /api/quizzes/:id
const updateQuiz = async (req, res) => {
    try {
        const quizId = req.params.id;
        let {
            title,
            description,
            questions,
            NoOfQuestion,
            timePerQuestion,
            passingCriteria,
            questionOrder,
            visibility,
            password,
            status,
            duration,
            participants,
            thumbnail,
            tags,
            schedule
        } = req.body;

        const quiz = await Quiz.findById(quizId).select('+password');

        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        if (visibility === 'password-protected') {
            if (password) {
                const salt = await bcrypt.genSalt(10);
                quiz.password = await bcrypt.hash(password, salt);
            } else if (!quiz.password) {
                return res.status(400).json({ success: false, message: 'Password is required when changing visibility to password-protected.' });
            }
        } else if (quiz.visibility === 'password-protected' && visibility !== 'password-protected') {
            quiz.password = undefined;
        }

        if (questions !== undefined) {
            const invalidQuestionIds = questions.filter(id => !mongoose.Types.ObjectId.isValid(id));
            if (invalidQuestionIds.length > 0) {
                return res.status(400).json({ success: false, message: 'One or more provided question IDs are invalid.' });
            }

            quiz.questions = questions;
            quiz.NoOfQuestion = questions.length;
        }

        if (title !== undefined) quiz.title = title;
        if (description !== undefined) quiz.description = description;
        if (timePerQuestion !== undefined) quiz.timePerQuestion = timePerQuestion;
        if (passingCriteria !== undefined) quiz.passingCriteria = passingCriteria;
        if (questionOrder !== undefined) quiz.questionOrder = questionOrder;
        if (visibility !== undefined) quiz.visibility = visibility;
        if (status !== undefined) quiz.status = status;
        if (duration !== undefined) quiz.duration = duration;
        if (participants !== undefined) {
            const invalidParticipantIds = participants.filter(id => !mongoose.Types.ObjectId.isValid(id));
            if (invalidParticipantIds.length > 0) {
                return res.status(400).json({ success: false, message: 'One or more provided participant IDs are invalid.' });
            }
            quiz.participants = participants;
        }
        if (thumbnail !== undefined) quiz.thumbnail = thumbnail;
        if (tags !== undefined) quiz.tags = tags;
        if (schedule !== undefined) quiz.schedule = schedule;


        const updatedQuiz = await quiz.save();

        const quizResponse = updatedQuiz.toObject();
        delete quizResponse.password;

        res.status(200).json({ success: true, data: quizResponse });
    } catch (error) {
        console.error('Error updating quiz:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'Invalid Quiz ID or other ID format' });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @route   DELETE /api/quizzes/:id
const deleteQuiz = async (req, res) => {
    try {
        const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id);

        if (!deletedQuiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        res.status(200).json({ success: true, message: 'Quiz deleted successfully', data: {} });
    } catch (error) {
        console.error('Error deleting quiz:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'Invalid Quiz ID format' });
        }
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

const getAccessibleQuizzesByUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const quizzes = await Quiz.find({
            $or: [
                { visibility: "public" },
                {
                    visibility: "private",
                    participants: userId
                }
            ]
        })
            .select("-password")
            .populate("creator", "username email")
            .populate("participants", "username email");

        res.status(200).json({
            error: null,
            message: "Accessible quizzes fetched successfully",
            data: quizzes
        });
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        res.status(500).json({
            error: "Failed tp fetch data.",
            message: "Server error while fetching quizzes",
            data: null
        });
    }
};

const checkPasswordProtectedQuizAccess = async (req, res) => {
    try {
        const { quizId, userId, password } = req.body;

        // Validate ObjectIds
        if (!mongoose.Types.ObjectId.isValid(quizId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid IDs provided." });
        }

        // Validate password presence
        if (!password) {
            return res.status(400).json({ success: false, message: "Password is required." });
        }

        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ success: false, message: "Quiz not found." });
        }

        if (quiz.visibility !== "password-protected") {
            return res.status(403).json({ success: false, message: "Quiz is not password protected." });
        }

        if (!quiz.password) {
            return res.status(500).json({ success: false, message: "Password not set for this protected quiz." });
        }

        // Check if user is a participant
        const isParticipant = quiz.participants.some((participantId) =>
            participantId.equals(userId)
        );

        if (!isParticipant) {
            return res.status(403).json({ success: false, message: "User is not a participant." });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, quiz.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Incorrect password." });
        }

        return res.status(200).json({ success: true, message: "Access granted." });

    } catch (error) {
        console.error("Error checking quiz access:", error);
        return res.status(500).json({ success: false, message: "Server error." });
    }
};

module.exports = {
    checkPasswordProtectedQuizAccess,
    getAccessibleQuizzesByUser,
    getQuizById,
    deleteQuiz,
    updateQuiz,
    getAllQuizzes,
    createQuiz
}