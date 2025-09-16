import express from 'express';
import {
  createRecurringTransaction,
  getRecurringTransactions,
  getRecurringTransactionById,
  updateRecurringTransaction,
  deleteRecurringTransaction,
  getRecurringTransactionsByUser,
  getActiveRecurringTransactions
} from '../controllers/RecurringTransactionController.js';

const router = express.Router();

// Create a new recurring transaction
router.post('/', createRecurringTransaction);

// Get all recurring transactions with optional filters
router.get('/', getRecurringTransactions);

// Get active recurring transactions
router.get('/active', getActiveRecurringTransactions);

// Get recurring transactions by user ID
router.get('/user/:userId', getRecurringTransactionsByUser);

// Get single recurring transaction by ID
router.get('/:id', getRecurringTransactionById);

// Update recurring transaction
router.put('/:id', updateRecurringTransaction);

// Delete recurring transaction
router.delete('/:id', deleteRecurringTransaction);

export default router;