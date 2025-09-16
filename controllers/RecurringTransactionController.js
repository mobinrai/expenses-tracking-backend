import {RecurringTransaction} from '../models/allModels.js';

// Create a new recurring transaction
export const createRecurringTransaction = async (req, res) => {
  try {
    const recurringTransaction = new RecurringTransaction(req.body);
    const savedRecurringTransaction = await recurringTransaction.save();
    
    // Populate references for the response
    await savedRecurringTransaction.populate([
      { path: 'userId', select: 'name email' },
      { path: 'accountId', select: 'name type' },
      { path: 'categoryId', select: 'name type' }
    ]);
    
    res.status(201).json({
      success: true,
      data: savedRecurringTransaction,
      message: 'Recurring transaction created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all recurring transactions with filtering options
export const getRecurringTransactions = async (req, res) => {
  try {
    const { userId, type, frequency } = req.query;
    let query = {};
    
    if (userId) query.userId = userId;
    if (type) query.type = type;
    if (frequency) query.frequency = frequency;
    
    const recurringTransactions = await RecurringTransaction.find(query)
      .populate('userId', 'name email')
      .populate('accountId', 'name type')
      .populate('categoryId', 'name type')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: recurringTransactions,
      count: recurringTransactions.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single recurring transaction by ID
export const getRecurringTransactionById = async (req, res) => {
  try {
    const recurringTransaction = await RecurringTransaction.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('accountId', 'name type')
      .populate('categoryId', 'name type');
    
    if (!recurringTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Recurring transaction not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: recurringTransaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update recurring transaction
export const updateRecurringTransaction = async (req, res) => {
  try {
    const recurringTransaction = await RecurringTransaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'name email')
     .populate('accountId', 'name type')
     .populate('categoryId', 'name type');
    
    if (!recurringTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Recurring transaction not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: recurringTransaction,
      message: 'Recurring transaction updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete recurring transaction
export const deleteRecurringTransaction = async (req, res) => {
  try {
    const recurringTransaction = await RecurringTransaction.findByIdAndDelete(req.params.id);
    
    if (!recurringTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Recurring transaction not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Recurring transaction deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get recurring transactions by user ID
export const getRecurringTransactionsByUser = async (req, res) => {
  try {
    const recurringTransactions = await RecurringTransaction.find({ userId: req.params.userId })
      .populate('userId', 'name email')
      .populate('accountId', 'name type')
      .populate('categoryId', 'name type')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: recurringTransactions,
      count: recurringTransactions.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get active recurring transactions (where endDate is null or in the future)
export const getActiveRecurringTransactions = async (req, res) => {
  try {
    const { userId } = req.query;
    let query = {
      $or: [
        { endDate: null },
        { endDate: { $gte: new Date() } }
      ]
    };
    
    if (userId) query.userId = userId;
    
    const recurringTransactions = await RecurringTransaction.find(query)
      .populate('userId', 'name email')
      .populate('accountId', 'name type')
      .populate('categoryId', 'name type')
      .sort({ startDate: 1 });
    
    res.status(200).json({
      success: true,
      data: recurringTransactions,
      count: recurringTransactions.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};