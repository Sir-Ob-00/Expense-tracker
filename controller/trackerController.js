import Tracker from '../model/tracker.js';
import mongoose from 'mongoose';

/* ---------------------------------- */
/* Utility: Validate Mongo ObjectId   */
/* ---------------------------------- */
const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

/* ---------------------------------- */
/* CREATE: Add Expense                */
/* ---------------------------------- */
export const addExpense = async (req, res) => {
    try {
        const { title, amount, category, date } = req.body;

        // Basic field validation
        if (!title || !amount || !category || !date) {
            return res.status(400).json({
                error: 'All fields (title, amount, category, date) are required.'
            });
        }

        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({
                error: 'Amount must be a positive number.'
            });
        }

        const expense = await Tracker.create(req.body);

        return res.status(201).json({
            message: 'Expense created successfully.',
            data: expense
        });

    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
};

/* ---------------------------------- */
/* READ: Get All Expenses             */
/* ---------------------------------- */
export const getAllExpenses = async (req, res) => {
    try {
        const expenses = await Tracker.find().sort({ date: -1 });

        return res.status(200).json({
            count: expenses.length,
            data: expenses
        });

    } catch (error) {
        return res.status(500).json({
            error: 'Server error while fetching expenses.'
        });
    }
};

/* ---------------------------------- */
/* READ: Get Expense By ID            */
/* ---------------------------------- */
export const getExpenseById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                error: 'Invalid expense ID format.'
            });
        }

        const expense = await Tracker.findById(id);

        if (!expense) {
            return res.status(404).json({
                error: 'Expense not found.'
            });
        }

        return res.status(200).json(expense);

    } catch (error) {
        return res.status(500).json({
            error: 'Server error while fetching expense.'
        });
    }
};

/* ---------------------------------- */
/* READ: Get Total Expenses           */
/* ---------------------------------- */
export const getTotalExpenses = async (req, res) => {
    try {
        const result = await Tracker.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        const total = result[0]?.totalAmount || 0;

        return res.status(200).json({ total });

    } catch (error) {
        return res.status(500).json({
            error: 'Server error while calculating total.'
        });
    }
};

/* ---------------------------------- */
/* READ: Filter by Category           */
/* ---------------------------------- */
export const getByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        const expenses = await Tracker.find({ category })
            .sort({ date: -1 });

        return res.status(200).json({
            count: expenses.length,
            data: expenses
        });

    } catch (error) {
        return res.status(500).json({
            error: 'Server error while filtering by category.'
        });
    }
};

/* ---------------------------------- */
/* READ: Filter by Date Range         */
/* ---------------------------------- */
export const getByDateRange = async (req, res) => {
    try {
        const { start, end } = req.query;

        if (!start || !end) {
            return res.status(400).json({
                error: 'Start and end dates are required (YYYY-MM-DD).'
            });
        }

        const startDate = new Date(start);
        const endDate = new Date(end);

        if (isNaN(startDate) || isNaN(endDate)) {
            return res.status(400).json({
                error: 'Invalid date format. Use YYYY-MM-DD.'
            });
        }

        const nextDay = new Date(endDate);
        nextDay.setDate(nextDay.getDate() + 1);

        const expenses = await Tracker.find({
            date: { $gte: startDate, $lt: nextDay }
        }).sort({ date: -1 });

        return res.status(200).json({
            count: expenses.length,
            data: expenses
        });

    } catch (error) {
        return res.status(500).json({
            error: 'Server error while filtering by date range.'
        });
    }
};

/* ---------------------------------- */
/* UPDATE: Update Expense             */
/* ---------------------------------- */
export const updateExpense = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                error: 'Invalid expense ID format.'
            });
        }

        const expense = await Tracker.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!expense) {
            return res.status(404).json({
                error: 'Expense not found.'
            });
        }

        return res.status(200).json({
            message: 'Expense updated successfully.',
            data: expense
        });

    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
};

/* ---------------------------------- */
/* DELETE: Delete Expense             */
/* ---------------------------------- */
export const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                error: 'Invalid expense ID format.'
            });
        }

        const expense = await Tracker.findByIdAndDelete(id);

        if (!expense) {
            return res.status(404).json({
                error: 'Expense not found.'
            });
        }

        return res.status(200).json({
            message: 'Expense deleted successfully.'
        });

    } catch (error) {
        return res.status(500).json({
            error: 'Server error while deleting expense.'
        });
    }
};