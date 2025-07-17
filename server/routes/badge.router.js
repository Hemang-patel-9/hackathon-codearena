const express = require('express');
const router = express.Router();
const badgeController = require('../controllers/badge.controller');

// Base route for /api/badges
router.route('/')
    .post(badgeController.createBadge)
    .get(badgeController.getAllBadges);

// Route for /api/badges/:id
router.route('/:id')
    .get(badgeController.getBadgeById)
    .put(badgeController.updateBadge)
    .delete(badgeController.deleteBadge);

module.exports = router;