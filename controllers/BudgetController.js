import {Budget} from '../models/allModels.js';

// Create a new budget
export const createBudget = async (req, res) => {
    try {
        const budget = new Budget(req.body);
        const savedBudget = await budget.save();
        res.status(201).json({
        success: true,
        data: savedBudget,
        message: 'Budget created successfully'
        });
    } catch (error) {
        res.status(400).json({
        success: false,
        message: error.message
        });
    }
};

// Get all budgets
export const getBudgets = async (req, res) => {
    try {
        const { userId } = req.query;
        let query = {};
        
        if (userId) {
        query.userId = userId;
        }
        
        const budgets = await Budget.find(query)
        .populate('userId', 'name email')
        .populate('categoryId', 'name');
        
        res.status(200).json({
        success: true,
        data: budgets,
        count: budgets.length
        });
    } catch (error) {
        res.status(500).json({
        success: false,
        message: error.message
        });
    }
};

// Get single budget by ID
export const getBudgetById = async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id)
        .populate('userId', 'name email')
        .populate('categoryId', 'name');
        
        if (!budget) {
        return res.status(404).json({
            success: false,
            message: 'Budget not found'
        });
        }
        
        res.status(200).json({
        success: true,
        data: budget
        });
    } catch (error) {
        res.status(500).json({
        success: false,
        message: error.message
        });
    }
};

// Update budget
export const updateBudget = async (req, res) => {
    try {
        const budget = await Budget.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
        ).populate('userId', 'name email')
        .populate('categoryId', 'name');
        
        if (!budget) {
        return res.status(404).json({
            success: false,
            message: 'Budget not found'
        });
        }
        
        res.status(200).json({
        success: true,
        data: budget,
        message: 'Budget updated successfully'
        });
    } catch (error) {
        res.status(400).json({
        success: false,
        message: error.message
        });
    }
};

// Delete budget
export const deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findByIdAndDelete(req.params.id);
        
        if (!budget) {
        return res.status(404).json({
            success: false,
            message: 'Budget not found'
        });
        }
        
        res.status(200).json({
        success: true,
        message: 'Budget deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
        success: false,
        message: error.message
        });
    }
};

// Get budgets by user ID
export const getBudgetsByUser = async (req, res) => {
    try {
        const budgets = await Budget.find({ userId: req.params.userId })
        .populate('userId', 'name email')
        .populate('categoryId', 'name');
        
        res.status(200).json({
        success: true,
        data: budgets,
        count: budgets.length
        });
    } catch (error) {
        res.status(500).json({
        success: false,
        message: error.message
        });
    }
};