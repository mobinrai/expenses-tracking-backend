import {Transaction} from "../models/allModels.js";

// Create a new transaction
export const createTransaction = async (req, res) => {
    try {
        const transaction = new Transaction(req.body);
        const savedTransaction = await transaction.save();
        
        // Populate references for better response
        await savedTransaction.populate([
        { path: 'userId', select: 'name email' },
        { path: 'accountId', select: 'name type' },
        { path: 'categoryId', select: 'name type' }
        ]);
        
        res.status(201).json({
        success: true,
        data: savedTransaction
        });
    } catch (error) {
        res.status(400).json({
        success: false,
        message: error.message
        });
    }
};

// Get all transactions with optional filtering
export const getTransactions = async (req, res) => {
    try {
        const {
        userId,
        accountId,
        categoryId,
        type,
        startDate,
        endDate,
        page = 1,
        limit = 10,
        sortBy = 'date',
        sortOrder = 'desc'
        } = req.query;

        // Build filter object
        const filter = {};
        if (userId) filter.userId = userId;
        if (accountId) filter.accountId = accountId;
        if (categoryId) filter.categoryId = categoryId;
        if (type) filter.type = type;
        
        // Date range filter
        if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
        }

        // Pagination and sorting
        const skip = (page - 1) * limit;
        const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

        const transactions = await Transaction.find(filter)
        .populate([
            { path: 'userId', select: 'name email' },
            { path: 'accountId', select: 'name type' },
            { path: 'categoryId', select: 'name type icon' }
        ])
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

        const total = await Transaction.countDocuments(filter);

        res.json({
        success: true,
        data: transactions,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
        }
        });
    } catch (error) {
        res.status(500).json({
        success: false,
        message: error.message
        });
    }
};

// Get single transaction by ID
export const getTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id)
        .populate([
            { path: 'userId', select: 'name email' },
            { path: 'accountId', select: 'name type' },
            { path: 'categoryId', select: 'name type' }
        ]);

        if (!transaction) {
        return res.status(404).json({
            success: false,
            message: 'Transaction not found'
        });
        }

        res.json({
        success: true,
        data: transaction
        });
    } catch (error) {
        res.status(500).json({
        success: false,
        message: error.message
        });
    }
};

// Update transaction
export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate([
      { path: 'userId', select: 'name email' },
      { path: 'accountId', select: 'name type' },
      { path: 'categoryId', select: 'name type' }
    ]);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete transaction
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get transactions summary (total income, expense, etc.)
export const getTransactionSummary = async (req, res) => {
    try {
        const { userId, startDate, endDate } = req.query;
        
        const filter = { userId };
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        const summary = await Transaction.aggregate([
        { $match: filter },
        {
            $group: {
            _id: '$type',
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 }
            }
        }
        ]);

        res.json({
        success: true,
        data: summary
        });
    } catch (error) {
        res.status(500).json({
        success: false,
        message: error.message
        });
    }
};