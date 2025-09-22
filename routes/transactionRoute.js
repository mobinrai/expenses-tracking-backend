import express from "express"
import { createTransaction, getTransactions,getTransactionSummary, getTransaction, updateTransaction, deleteTransaction } from "../controllers/TransactionController.js"

const router = express.Router()
// CRUD routes
router.post('/', createTransaction);
router.get('/', getTransactions);
router.get('/summary', getTransactionSummary);
router.get('/:id', getTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;