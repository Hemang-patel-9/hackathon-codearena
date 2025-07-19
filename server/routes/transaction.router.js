const express = require('express');
const router = express.Router();

const {
    getAllTransactions,
    createTransaction,
    updateTransaction,
    getTransactionsByUserId
} = require('../controllers/transaction.controller');

router.get('/', getAllTransactions);
router.post('/', createTransaction);
router.put('/:id', updateTransaction);
router.get('/user/:userId', getTransactionsByUserId);

module.exports = router;