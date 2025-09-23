import express from 'express';
import {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
  getBudgetsByUser,
  getBudgetVsSpending,
  getBudgetsWithProgress
} from '../controllers/BudgetController.js';

const router = express.Router();

// Create a new budget
router.post('/', createBudget);

// Get all budgets (with optional user filter)
router.get('/', getBudgets);

// Get budgets by specific user
router.get('/user/:userId', getBudgetsByUser);

router.get('/get-budget-with-progress/:userId', getBudgetsWithProgress);

router.get('/get-budget-spending/:userId/:period', getBudgetVsSpending);

// Get single budget by ID
router.get('/:id', getBudgetById);

// Update budget
router.put('/:id', updateBudget);

// Delete budget
router.delete('/:id', deleteBudget);

export default router;