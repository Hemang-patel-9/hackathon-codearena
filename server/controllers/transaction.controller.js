const TransactionSchema = require('../models/transaction.model');
const mongoose = require('mongoose');

// Get all transactions
const getAllTransactions = async (req, res) => {
  try {
    console.log("0000")
    const transactions = await TransactionSchema.find();
    return res.status(200).json({
      error: false,
      message: 'All transactions fetched successfully',
      data: transactions
    });
  } catch (err) {
    console.error('Error fetching all transactions:', err);
    return res.status(500).json({
      error: true,
      message: 'Server error while fetching transactions',
      data: []
    });
  }
};

// Create new transaction
const createTransaction = async (req, res) => {
  try {
    const { userId, totalPrice, status, transactionId } = req.body;

    if (!userId || !totalPrice || !status || !transactionId) {
      return res.status(400).json({
        error: true,
        message: 'Missing required fields',
        data: []
      });
    }

    const newOrder = new TransactionSchema({
      userId,
      totalPrice,
      status,
      transactionId
    });

    const savedOrder = await newOrder.save();

    return res.status(201).json({
      error: false,
      message: 'Transaction created successfully',
      data: [savedOrder]
    });
  } catch (err) {
    console.error('Error creating transaction:', err);
    return res.status(500).json({
      error: true,
      message: 'Server error while creating transaction',
      data: []
    });
  }
};

// Update transaction by ID
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: true,
        message: 'Invalid transaction ID',
        data: []
      });
    }

    const updatedOrder = await TransactionSchema.findByIdAndUpdate(id, updateData, {
      new: true
    });

    if (!updatedOrder) {
      return res.status(404).json({
        error: true,
        message: 'Transaction not found',
        data: []
      });
    }

    return res.status(200).json({
      error: false,
      message: 'Transaction updated successfully',
      data: [updatedOrder]
    });
  } catch (err) {
    console.error('Error updating transaction:', err);
    return res.status(500).json({
      error: true,
      message: 'Server error while updating transaction',
      data: []
    });
  }
};

// Get transactions by user ID
const getTransactionsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        error: true,
        message: 'Invalid user ID',
        data: []
      });
    }

    const userTransactions = await TransactionSchema.find({ userId });

    return res.status(200).json({
      error: false,
      message: 'Transactions fetched for user',
      data: userTransactions
    });
  } catch (err) {
    console.error('Error fetching user transactions:', err);
    return res.status(500).json({
      error: true,
      message: 'Server error while fetching user transactions',
      data: []
    });
  }
};

module.exports = {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  getTransactionsByUserId
};