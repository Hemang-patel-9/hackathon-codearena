// controllers/scoreboardController.js
const Scoreboard = require('../models/score.model');
const Quiz = require('../models/quiz.model');
const User = require('../models/user.model');

const validateParticipantScore = async (participant) => {
    if (!participant || !participant.userId || !participant.username || participant.score === undefined || participant.rank === undefined) {
        return { isValid: false, message: 'Each participant score entry must have userId, username, score, and rank.' };
    }
    if (!mongoose.Types.ObjectId.isValid(participant.userId)) {
        return { isValid: false, message: `Invalid userId format for participant ${participant.username}.` };
    }
    // }
    return { isValid: true };
};

// @route   POST /api/scoreboards
exports.createOrUpdateScoreboard = async (req, res) => {
    try {
        const { quizId, participantScores } = req.body;

        if (!quizId || !mongoose.Types.ObjectId.isValid(quizId)) {
            return res.status(400).json({ success: false, message: 'Valid quizId is required.' });
        }

        if (!participantScores || !Array.isArray(participantScores) || participantScores.length === 0) {
            return res.status(400).json({ success: false, message: 'At least one participant score is required.' });
        }

        for (let i = 0; i < participantScores.length; i++) {
            const validation = await validateParticipantScore(participantScores[i]);
            if (!validation.isValid) {
                return res.status(400).json({ success: false, message: validation.message });
            }
        }

        const updatedScoreboard = await Scoreboard.findOneAndUpdate(
            { quizId },
            {
                $push: {
                    participantScores: {
                        $each: participantScores.map(p => ({
                            userId: p.userId,
                            username: p.username,
                            score: p.score,
                            correctAnswersCount: p.correctAnswersCount || 0,
                            averageResponseTime: p.averageResponseTime || 0,
                            rank: p.rank
                        }))
                    }
                }
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true 
            }
        );

        res.status(200).json({ success: true, data: updatedScoreboard });

    } catch (error) {
        console.error('Error creating or updating scoreboard:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @route   GET /api/scoreboards/:quizId
exports.getScoreboardByQuizId = async (req, res) => {
    try {
        const quizId = req.params.quizId;

        if (!mongoose.Types.ObjectId.isValid(quizId)) {
            return res.status(400).json({ success: false, message: 'Invalid Quiz ID format.' });
        }

        const scoreboard = await Scoreboard.findOne({ quizId })
            .populate('quizId', 'title description')
            .populate('participantScores.userId', 'username email'); 

        if (!scoreboard) {
            return res.status(404).json({ success: false, message: 'Scoreboard not found for this quiz.' });
        }

        scoreboard.participantScores.sort((a, b) => a.rank - b.rank || b.score - a.score);


        res.status(200).json({ success: true, data: scoreboard });
    } catch (error) {
        console.error('Error fetching scoreboard:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'Invalid ID format in URL.' });
        }
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @route   PUT /api/scoreboards/:quizId/participants/:userId
exports.updateParticipantScore = async (req, res) => {
    try {
        const { quizId, userId } = req.params;
        const { score, correctAnswersCount, averageResponseTime, rank, username } = req.body;

        if (!mongoose.Types.ObjectId.isValid(quizId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid Quiz ID or User ID format.' });
        }

        if (score === undefined || rank === undefined) {
             return res.status(400).json({ success: false, message: 'Score and rank are required for updating a participant.' });
        }

        const scoreboard = await Scoreboard.findOne({ quizId });

        if (!scoreboard) {
            return res.status(404).json({ success: false, message: 'Scoreboard not found for this quiz.' });
        }

        const participantIndex = scoreboard.participantScores.findIndex(
            p => p.userId && p.userId.toString() === userId.toString()
        );

        if (participantIndex === -1) {
            return res.status(404).json({ success: false, message: 'Participant not found on this scoreboard.' });
        }

        const participant = scoreboard.participantScores[participantIndex];
        participant.score = score;
        if (correctAnswersCount !== undefined) participant.correctAnswersCount = correctAnswersCount;
        if (averageResponseTime !== undefined) participant.averageResponseTime = averageResponseTime;
        if (rank !== undefined) participant.rank = rank;
        if (username !== undefined) participant.username = username;

        const updatedScoreboard = await scoreboard.save();

        res.status(200).json({ success: true, data: updatedScoreboard });

    } catch (error) {
        console.error('Error updating participant score:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'Invalid ID format in URL or body.' });
        }
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @route   DELETE /api/scoreboards/:quizId
exports.deleteScoreboard = async (req, res) => {
    try {
        const quizId = req.params.quizId;

        if (!mongoose.Types.ObjectId.isValid(quizId)) {
            return res.status(400).json({ success: false, message: 'Invalid Quiz ID format.' });
        }

        const deletedScoreboard = await Scoreboard.findOneAndDelete({ quizId });

        if (!deletedScoreboard) {
            return res.status(404).json({ success: false, message: 'Scoreboard not found for this quiz.' });
        }

        res.status(200).json({ success: true, message: 'Scoreboard deleted successfully', data: {} });
    } catch (error) {
        console.error('Error deleting scoreboard:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'Invalid ID format in URL.' });
        }
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};