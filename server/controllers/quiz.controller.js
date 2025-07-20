// controllers/quizController.js
const Quiz = require('../models/quiz.model');
const bcrypt = require('bcryptjs');
const Question = require('../models/question.model');
const mongoose = require('mongoose');
const scoreModel = require('../models/score.model');
const checkToxic = require('../helpers/toxicity.helper')

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

        for (const question of questions) {
            try {
                const isToxic = await checkToxic.detectToxicity(question.questionText);
                console.log(question.questionText)
                if (isToxic) {
                    const joiner = [question.questionText, "contains toxic content. Please remove or change it."];
                    return res.status(400).json({
                        error: joiner.join(" "),
                        data: null,
                        message: "Please enter appropriate questions."
                    });
                }
            } catch (err) {
                return res.status(500).json({
                    error: "Internal toxicity check error.",
                    data: null,
                    message: err.message
                });
            }
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
            // if (invalidQuestionIds.length > 0) {
            //     return res.status(400).json({ success: false, message: 'One or more provided question IDs are invalid.' });
            // }

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
            // if (invalidParticipantIds.length > 0) {
            //     return res.status(400).json({ success: false, message: 'One or more provided participant IDs are invalid.' });
            // }
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

const getUserQuizzes = async (req, res) => {
    try {
        const userId = req.params.id;

        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID'
            });
        }

        // Get all quizzes created by the user
        const createdQuizzes = await Quiz.find({ creator: userId })
            .select('title description questions passingCriteria timePerQuestion NoOfQuestion visibility password status duration schedule participants thumbnail tags createdAt')
            .populate('participants', 'username email avatar')
            .sort({ createdAt: -1 });

        // Get all quizzes where user has participated (from scoreboard)
        const participatedScoreboards = await scoreModel.find({
            'participantScores.userId': userId
        })
            .populate({
                path: 'quizId',
                select: 'title description status duration schedule creator thumbnail tags createdAt',
                populate: {
                    path: 'creator',
                    select: 'username email avatar'
                }
            })
            .sort({ createdAt: -1 });

        // Extract participated quizzes with user's scores
        const participatedQuizzes = participatedScoreboards.map(scoreboard => {
            const userScore = scoreboard.participantScores.find(
                score => score.userId.toString() === userId
            );

            return {
                quiz: scoreboard.quizId,
                scoreDetails: {
                    score: userScore.score,
                    correctAnswersCount: userScore.correctAnswersCount,
                    averageResponseTime: userScore.averageResponseTime,
                    rank: userScore.rank,
                    totalParticipants: scoreboard.participantScores.length
                },
                participatedAt: scoreboard.createdAt
            };
        });

        // Get summary statistics
        const totalCreated = createdQuizzes.length;
        const totalParticipated = participatedQuizzes.length;
        const averageScore = participatedQuizzes.length > 0
            ? participatedQuizzes.reduce((sum, quiz) => sum + quiz.scoreDetails.score, 0) / participatedQuizzes.length
            : 0;

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalCreated,
                    totalParticipated,
                    averageScore: Math.round(averageScore * 100) / 100
                },
                createdQuizzes,
                participatedQuizzes
            }
        });

    } catch (error) {
        console.error('Error fetching user quizzes:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching user quizzes',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get all public quizzes available for participation
const getPublicQuizzes = async (req, res) => {
    try {
        // Find public quizzes that are upcoming or active, and ensure creator exists
        const quizzes = await Quiz.find({
            visibility: 'public',
            status: { $in: ['upcoming', 'active'] },
            creator: { $exists: true, $ne: null }, // Ensure creator field is not null
        })
            .select('title description schedule duration NoOfQuestion timePerQuestion thumbnail status')
            .populate({
                path: 'creator',
                select: 'username avatar',
                match: { _id: { $exists: true } }, // Ensure populated creator exists
            })
            .sort({ schedule: 1 }); // Sort by schedule in ascending order

        // Filter out quizzes where creator failed to populate
        const validQuizzes = quizzes.filter(quiz => quiz.creator !== null);

        if (!validQuizzes || validQuizzes.length === 0) {
            return res.status(404).json({
                error: 'No public quizzes found with upcoming or active status',
                message: 'No public quizzes found with upcoming or active status',
                data: null,
            });
        }

        // Return the list of public quizzes
        return res.status(200).json({
            error: null,
            message: 'Public quizzes retrieved successfully',
            data: validQuizzes,
        });
    } catch (error) {
        console.error('Error fetching public quizzes:', error);
        return res.status(500).json({
            error: error.message,
            message: 'Server error while fetching public quizzes',
            data: null,
        });
    }
};

// Get upcoming private quizzes for a specific user
const getUpcomingQuizzes = async (req, res) => {
    try {
        // Get userId from query parameter
        const userId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                error: 'Invalid user ID',
                message: 'Invalid user ID',
                data: null,
            });
        }

        // Find upcoming private quizzes where the user is a participant
        const quizzes = await Quiz.find({
            visibility: 'private',
            status: 'upcoming',
            participants: userId,
        })
            .select('title description schedule duration NoOfQuestion timePerQuestion thumbnail')
            .populate('creator', 'username avatar') // Populate creator's username and avatar
            .sort({ schedule: 1 }); // Sort by schedule in ascending order

        if (!quizzes || quizzes.length === 0) {
            return res.status(404).json({
                error: 'No upcoming private quizzes found for this user',
                message: 'No upcoming private quizzes found for this user',
                data: null,
            });
        }

        // Return the list of upcoming private quizzes
        return res.status(200).json({
            error: null,
            message: 'Upcoming private quizzes retrieved successfully',
            data: quizzes,
        });
    } catch (error) {
        console.error('Error fetching upcoming private quizzes:', error);
        return res.status(500).json({
            error: error.message,
            message: 'Server error while fetching quizzes',
            data: null,
        });
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

const getRandomQuizQuestions = async (req, res) => {
    try {
        const { count } = req.body;
        const quizId = req.params.id;

        // Validate input
        if (!count || count <= 0) {
            return res.status(400).json({ error: true, message: "Invalid question count provided." });
        }

        // Fetch quiz from DB
        const quiz = await Quiz.findById(quizId).populate('questions');

        if (!quiz) {
            return res.status(404).json({ error: true, message: "Quiz not found." });
        }

        const questions = quiz.questions || [];
        const totalQuestions = questions.length;

        if (!Array.isArray(questions) || totalQuestions === 0) {
            return res.status(400).json({ error: true, message: "No questions available in this quiz." });
        }

        if (count > totalQuestions) {
            return res.status(400).json({
                error: true,
                message: `${count} questions requested, but only ${totalQuestions} available.`,
            });
        }

        const randomQuestions = getRandomItems(questions, count);

        return res.status(200).json({
            error: false,
            total: randomQuestions.length,
            questions: randomQuestions,
        });
    } catch (err) {
        console.error("Error fetching quiz questions:", err);
        return res.status(500).json({
            error: true,
            message: "Internal server error.",
        });
    }
};

const getRandomItems = (arr, count) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};


module.exports = {
    getRandomQuizQuestions,
    checkPasswordProtectedQuizAccess,
    getAccessibleQuizzesByUser,
    getQuizById,
    deleteQuiz,
    updateQuiz,
    deleteQuiz,
    getUserQuizzes,
    getPublicQuizzes,
    getUpcomingQuizzes,
    createQuiz,
    getAllQuizzes,
    getRandomQuizQuestions
}