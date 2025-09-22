import express from "express"
import { createTransaction, getTransactions,getTransactionSummary, getTransaction, updateTransaction, deleteTransaction } from "../controllers/TransactionController.js"

const router = express.Router()
// CRUD routes
router.post('/', createTransaction);
router.get('/', getTransactions);
router.get('/transactions/summary', getTransactionSummary);
router.get('/transactions/:id', getTransaction);
router.put('/transactions/:id', updateTransaction);
router.delete('/transactions/:id', deleteTransaction);

export default router;