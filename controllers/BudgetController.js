import mongoose from 'mongoose';
import {Budget, Transaction} from '../models/allModels.js';

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
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const budgets = await Budget.find({ userId })
      .populate('userId', 'name email')
      .populate('categoryId', 'name icon')
      .sort({ createdAt: -1 }) // Important for consistent pagination
      .skip(skip)
      .limit(limit);

    const total = await Budget.countDocuments({ userId });
    const hasNextPage = skip + budgets.length < total;

        res.status(200).json({
        success: true,
        data: budgets,
        pagination: {
            page,
            limit,
            total,
            hasNextPage,
            totalPages: Math.ceil(total / limit)
        }
        });
    } catch (error) {
        res.status(500).json({
        success: false,
        message: error.message
        });
    }
};

export const getBudgetVsSpending = async (req,res) => {
   
    const {userId, period} = req.params
    const periodUnitMap = {
        monthly: "month",
        quarterly: "quarter",
        yearly: "year"
    };
    const unit = periodUnitMap[period] || "month";
    const results = await Budget.aggregate([
        // Match user
        {
        $match: {
            userId: new mongoose.Types.ObjectId(userId)
        }
        },

    // Lookup transactions linked to category & user
    {
      $lookup: {
        from: "transactions",
        let: { categoryId: "$categoryId", userId: "$userId" },
        pipeline: [
            {
                $match: {
                $expr: {
                    $and: [
                    { $eq: ["$categoryId", "$$categoryId"] },
                    { $eq: ["$userId", "$$userId"] }
                    ]
                }
                }
            },
            {
                // Group transactions by the same period unit (month/quarter/year)
                $group: {
                _id: {
                    categoryId: "$categoryId",
                    period: { $dateTrunc: { date: "$date", unit: unit } }
                },
                totalSpending: { $sum: "$amount" }
                }
            }
            ],
            as: "spending"
        }
    },

    // Group budgets by category + period
    {
      $group: {
            _id: {
            categoryId: "$categoryId",
            period: { $dateTrunc: { date: "$startDate", unit: unit } }
            },
            totalBudget: { $sum: "$amount" },
            spending: { $first: "$spending" }
        }
    },

    // Merge spending totals
    {
      $project: {
            categoryId: "$_id.categoryId",
            period: "$_id.period",
            totalBudget: 1,
            totalSpending: {
            $ifNull: [
                {
                $arrayElemAt: ["$spending.totalSpending", 0]
                },
                0
            ]
            }
        }
    },

    // Lookup category details
    {
      $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category"
        }
    },
    { $unwind: "$category" },

    // Final shape
    {
      $project: {
        _id: 0,
        categoryId: 1,
        categoryName: "$category.name",
        categoryIcon:"$category.icon",
        period: 1,
        totalBudget: 1,
        totalSpending: 1
      }
    },

    // Sort by period
    { $sort: { period: 1, categoryName: 1 } }
    ]);

     res.status(200).json(results)
};



export const getBudgetsWithProgress = async (req,res) => {
  const budgets = await Budget.find({ userId:req.params.userId }).populate("categoryId");
  
    const results = await Promise.all(
        budgets.map(async (budget) => {
        const start = budget.startDate;
        const end = budget.endDate || new Date();

        const spent = await Transaction.aggregate([
            { 
            $match: { 
                userId: budget.userId, 
                categoryId: budget.categoryId._id, 
                type: "expense",
                date: { $gte: start, $lte: end }
            } 
            },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const totalSpent = spent.length ? spent[0].total : 0;
         return {
                budgetId: budget._id,
                category: budget.categoryId.name,
                allocated: budget.amount,
                spent: totalSpent,
                remaining: budget.amount - totalSpent,
                progress: Math.min((totalSpent / budget.amount) * 100, 100),
            }
        })
    );

    return res.status(200).json({
            success: true,
            data:results
    });
};
