const express = require('express');
const router = express.Router();
const { getTransactions, addTransaction, transferFunds } = require('../controllers/transactionController');
const protect = require('../middleware/authMiddleware');

// my protected routes
router.use(protect);

router.get('/', getTransactions);
router.post('/', addTransaction);
router.post('/transfer', transferFunds);

module.exports = router;