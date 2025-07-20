const mongoose = require("mongoose");
const Scoreboard = require('../models/score.model');
const Quiz = require('../models/quiz.model');
const User = require('../models/user.model');

// Validator for each participant
const validateParticipantScore = (participant) => {
    if (
        !participant ||
        !participant.userId ||
        !participant.username ||
        participant.score === undefined ||
        participant.rank === undefined
    ) {
        return {
            isValid: false,
            message: 'Each participant score entry must have userId, username, score, and rank.',
        };
    }
    return { isValid: true };
};

// @route POST /api/scoreboards
exports.createOrUpdateScoreboard = async (req, res) => {
    try {
        const { quizId, participantScores } = req.body;

        if (!quizId || !mongoose.Types.ObjectId.isValid(quizId)) {
            return res.status(400).json({ success: false, message: 'Valid quizId is required.' });
        }

        if (!participantScores || !Array.isArray(participantScores) || participantScores.length === 0) {
            return res.status(400).json({ success: false, message: 'At least one participant score is required.' });
        }

        for (const participant of participantScores) {
            const validation = validateParticipantScore(participant);
            if (!validation.isValid) {
                return res.status(400).json({ success: false, message: validation.message });
            }
        }

        // const updatedScoreboard = await Scoreboard.findOneAndUpdate(
        //     { quizId }, 
        //     {
        //         $push: {
        //             participantScores: {
        //                 $each: participantScores.map(p => ({
        //                     userId: p.userId,
        //                     username: p.username,
        //                     score: p.score,
        //                     correctAnswersCount: p.correctAnswersCount || 0,
        //                     rank: p.rank,
        //                     violations: p.violations || 0,
        //                     avatar: p.avatar || ''
        //                 }))
        //             }
        //         }
        //     },
        //     {
        //         new: true,
        //         upsert: true,
        //         runValidators: true,
        //         setDefaultsOnInsert: true
        //     }
        // );

        const createData = await Scoreboard.create({
            quizId, participantScores
        })

        res.status(200).json({ error: null, messae: "Score saved successfully to scoreboard", data: createData });
    } catch (error) {
        console.error('Error creating or updating scoreboard:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ data: null, message: 'Server Error', error: error.message });
    }
};

exports.createScoreBoard = async (quizId, participantScores) => {
    try {

        const createData = await Scoreboard.create({
            quizId, participantScores
        });

        res.status(200).json({ error: null, messae: "Score saved successfully to scoreboard", data: createData });
    }
    catch (err) {
        res.status(500).json({ data: null, message: 'Server Error', error: err.message });
    }
}

// @route GET /api/scoreboards/:quizId
exports.getScoreboardByQuizId = async (req, res) => {
    try {
        const quizId = req.params.quizId;

        if (!mongoose.Types.ObjectId.isValid(quizId)) {
            return res.status(400).json({ error: "Invlid data", message: 'Invalid Quiz ID format.' });
        }

        const scoreboard = await Scoreboard.findOne({ quizId })
            .populate('quizId', 'title description')
            .populate('participantScores.userId', 'username email avatar');

        if (!scoreboard) {
            return res.status(404).json({ error: "Invlid data", message: 'Scoreboard not found for this quiz.' });
        }

        scoreboard.participantScores.sort((a, b) => a.rank - b.rank || b.score - a.score);

        res.status(200).json({ error: null, data: scoreboard.participantScores, message: "Scoreboard Fetched successfully!" });
    } catch (error) {
        console.error('Error fetching scoreboard:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'Invalid ID format in URL.' });
        }
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @route PUT /api/scoreboards/:quizId/participants/:userId
exports.updateParticipantScore = async (req, res) => {
    try {
        const { quizId, userId } = req.params;
        const { score, correctAnswersCount, rank, username, violations, avatar } = req.body;

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

        const participant = scoreboard.participantScores.find(
            p => p.userId && p.userId.toString() === userId.toString()
        );

        if (!participant) {
            return res.status(404).json({ success: false, message: 'Participant not found on this scoreboard.' });
        }

        participant.score = score;
        if (correctAnswersCount !== undefined) participant.correctAnswersCount = correctAnswersCount;
        if (rank !== undefined) participant.rank = rank;
        if (username !== undefined) participant.username = username;
        if (violations !== undefined) participant.violations = violations;
        if (avatar !== undefined) participant.avatar = avatar;

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

// @route DELETE /api/scoreboards/:quizId
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
