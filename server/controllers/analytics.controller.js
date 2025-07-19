const Quiz = require("../models/quiz.model");
const User = require("../models/user.model");

const getQuizAnalytics = async (req, res) => {
    try {
        const quizzes = await Quiz.find({});

        const totalQuizzes = quizzes.length;
        const activeQuizzes = quizzes.filter(q => q.status === "active").length;
        const inactiveQuizzes = totalQuizzes - activeQuizzes;

        const visibilityCounts = {};
        const questionOrderCounts = {};
        const tagFrequency = {};
        const creatorMap = {};

        let totalQuestions = 0;
        let totalTimePerQuestion = 0;
        let totalPassingCriteria = 0;
        let scheduledCount = 0;

        const today = new Date();
        const todayStart = new Date(today.setHours(0, 0, 0, 0));
        const todayEnd = new Date(today.setHours(23, 59, 59, 999));
        let todayScheduled = 0;
        let upcomingScheduled = 0;

        for (let quiz of quizzes) {
            // Count visibility
            visibilityCounts[quiz.visibility] = (visibilityCounts[quiz.visibility] || 0) + 1;

            // Count questionOrder
            questionOrderCounts[quiz.questionOrder] = (questionOrderCounts[quiz.questionOrder] || 0) + 1;

            // Aggregate question/time stats
            totalQuestions += quiz.NoOfQuestion || 0;
            totalTimePerQuestion += quiz.timePerQuestion || 0;
            totalPassingCriteria += quiz.passingCriteria || 0;

            // Count scheduled
            if (quiz.schedule) {
                scheduledCount++;
                const scheduleDate = new Date(quiz.schedule);
                if (scheduleDate >= todayStart && scheduleDate <= todayEnd) {
                    todayScheduled++;
                } else if (scheduleDate > todayEnd) {
                    upcomingScheduled++;
                }
            }

            // Count tags
            if (Array.isArray(quiz.tags)) {
                for (let tag of quiz.tags) {
                    tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
                }
            }

            // Creator wise count
            const creatorId = quiz.creator;
            creatorMap[creatorId] = (creatorMap[creatorId] || 0) + 1;
        }

        const avgQuestions = totalQuizzes ? totalQuestions / totalQuizzes : 0;
        const avgTimePerQuestion = totalQuizzes ? totalTimePerQuestion / totalQuizzes : 0;
        const avgPassingCriteria = totalQuizzes ? totalPassingCriteria / totalQuizzes : 0;

        return res.status(200).json({
            error: null,
            message: "Quiz analytics generated successfully",
            data: {
                totalQuizzes,
                activeQuizzes,
                inactiveQuizzes,
                visibilityCounts,
                questionOrderCounts,
                averageQuestionsPerQuiz: avgQuestions.toFixed(2),
                averageTimePerQuestion: avgTimePerQuestion.toFixed(2),
                averagePassingCriteria: avgPassingCriteria.toFixed(2),
                scheduledCount,
                todayScheduled,
                upcomingScheduled,
                tagFrequency,
                creatorWiseQuizCount: creatorMap
            }
        });

    } catch (error) {
        console.error("Error fetching quiz analytics:", error);
        return res.status(500).json({
            error: error.message,
            message: "Failed to generate quiz analytics",
            data: null,
        });
    }
};

const getUserAnalytics = async (req, res) => {
  try {
    const users = await User.find();

    const totalUsers = users.length;
    const verifiedUsers = users.filter(u => u.isVerified).length;
    const bannedUsers = users.filter(u => u.isBanned).length;

    const roles = {};
    users.forEach(user => {
      roles[user.role] = (roles[user.role] || 0) + 1;
    });

    const recentUsers = users
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(user => ({
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }));

    res.json({
      success: true,
      message: 'User analytics fetched successfully',
      data: {
        totalUsers,
        verifiedUsers,
        unverifiedUsers: totalUsers - verifiedUsers,
        bannedUsers,
        notBannedUsers: totalUsers - bannedUsers,
        roleDistribution: roles,
        recentRegistrations: recentUsers
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user analytics', error: error.message });
  }
};

module.exports = {
    getQuizAnalytics,
    getUserAnalytics
};