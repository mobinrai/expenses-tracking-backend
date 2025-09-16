import express from "express"
import { createAccount, deleteAccount, getAccounts, getAccountById, updateAccount } from "../controllers/AccountController.js"

const router = express.Router()
// CRUD Routes
router.post("/", createAccount);     // Create
router.get("/", getAccounts);        // Read all
router.get("/:id", getAccountById);  // Read one
router.put("/:id", updateAccount);   // Update
router.delete("/:id", deleteAccount);// Delete

export default router;