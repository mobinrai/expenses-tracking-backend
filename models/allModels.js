import mongoose from "mongoose";

const { Schema } = mongoose;

// ================= USER =================
const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    currency: { type: String, default: "USD" }, // Default preferred currency
    createdAt: { type: Date, default: Date.now },
    settings: {
        darkMode: { type: Boolean, default: false },
        notifications: { type: Boolean, default: true },
    }
});

// ================= ACCOUNT =================
const AccountSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    type: { 
        type: String, 
        enum: ["cash", "bank", "credit", "investment", "other"], 
        required: true 
    },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    createdAt: { type: Date, default: Date.now }
});

// ================= CATEGORY =================
const CategorySchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ["expense", "income"], required: true },
    icon: { type: String },
    createdAt: { type: Date, default: Date.now }
});

// ================= TRANSACTION =================
const TransactionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    type: { type: String, enum: ["expense", "income", "transfer"], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    description: { type: String },
    date: { type: Date, default: Date.now },
    tags: [{ type: String }], // e.g., "business", "personal"
    recurringId: { type: Schema.Types.ObjectId, ref: "RecurringTransaction" },
    createdAt: { type: Date, default: Date.now }
});

// ================= RECURRING TRANSACTION =================
const RecurringTransactionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    type: { type: String, enum: ["expense", "income"], required: true },
    amount: { type: Number, required: true },
    frequency: { 
        type: String, 
        enum: ["daily", "weekly", "monthly", "yearly"], 
        required: true 
    },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    description: { type: String },
    createdAt: { type: Date, default: Date.now }
});

// ================= BUDGET =================
const BudgetSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    period: { type: String, enum: ["weekly", "monthly", "yearly"], required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

// ================= EXPORT MODELS =================
export const User = mongoose.model("User", UserSchema);
export const Account = mongoose.model("Account", AccountSchema);
export const Category = mongoose.model("Category", CategorySchema);
export const Transaction = mongoose.model("Transaction", TransactionSchema);
export const RecurringTransaction = mongoose.model("RecurringTransaction", RecurringTransactionSchema);
export const Budget = mongoose.model("Budget", BudgetSchema);
