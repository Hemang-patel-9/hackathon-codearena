// controllers/badgeController.js
const Badge = require('../models/badge.model');

// create new badge
// @route   POST /api/badges
exports.createBadge = async (req, res) => {
    try {
        const { name, icon } = req.body;

        // Basic validation
        if (!name || !icon) {
            return res.status(400).json({ success: false, message: 'Please provide both name and icon for the badge.' });
        }

        const newBadge = new Badge({
            name,
            icon
        });

        const savedBadge = await newBadge.save();
        res.status(201).json({ success: true, data: savedBadge });
    } catch (error) {
        console.error('Error creating badge:', error);
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ success: false, message: 'A badge with this name already exists.' });
        }
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// get all badges
// @route   GET /api/badges
exports.getAllBadges = async (req, res) => {
    try {
        const badges = await Badge.find({});
        res.status(200).json({ success: true, count: badges.length, data: badges });
    } catch (error) {
        console.error('Error fetching badges:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// get badge by id
// @route   GET /api/badges/:id
exports.getBadgeById = async (req, res) => {
    try {
        const badge = await Badge.findById(req.params.id);

        if (!badge) {
            return res.status(404).json({ success: false, message: 'Badge not found' });
        }

        res.status(200).json({ success: true, data: badge });
    } catch (error) {
        console.error('Error fetching badge by ID:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'Invalid Badge ID format' });
        }
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// update badge
// @route   PUT /api/badges/:id
exports.updateBadge = async (req, res) => {
    try {
        const { name, icon } = req.body;

        const updatedBadge = await Badge.findByIdAndUpdate(
            req.params.id,
            { name, icon },
            { new: true, runValidators: true }
        );

        if (!updatedBadge) {
            return res.status(404).json({ success: false, message: 'Badge not found' });
        }

        res.status(200).json({ success: true, data: updatedBadge });
    } catch (error) {
        console.error('Error updating badge:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'Invalid Badge ID format' });
        }
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'A badge with this name already exists.' });
        }
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// delete badge
// @route   DELETE /api/badges/:id
exports.deleteBadge = async (req, res) => {
    try {
        const deletedBadge = await Badge.findByIdAndDelete(req.params.id);

        if (!deletedBadge) {
            return res.status(404).json({ success: false, message: 'Badge not found' });
        }

        res.status(200).json({ success: true, message: 'Badge deleted successfully', data: {} });
    } catch (error) {
        console.error('Error deleting badge:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'Invalid Badge ID format' });
        }
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};