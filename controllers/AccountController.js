import {Account} from "../models/allModels.js";

// Create new account
export const createAccount = async (req, res) => {
    try {
        const account = new Account(req.body);
        const savedAccount = await account.save();
        res.status(201).json(savedAccount);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all accounts
export const getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find().populate("userId");
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get account by ID
export const getAccountById = async (req, res) => {
    try {
        const account = await Account.findById(req.params.id).populate("userId");
        if (!account) return res.status(404).json({ message: "Account not found" });
        res.json(account);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update account
export const updateAccount = async (req, res) => {
    try {
        const updatedAccount = await Account.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
        );
        if (!updatedAccount) return res.status(404).json({ message: "Account not found" });
        res.json(updatedAccount);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete account
export const deleteAccount = async (req, res) => {
    try {
        const deletedAccount = await Account.findByIdAndDelete(req.params.id);
        if (!deletedAccount) return res.status(404).json({ message: "Account not found" });
        res.json({ message: "Account deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
