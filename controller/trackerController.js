import Tracker from '../model/tracker.js';
import mongoose from 'mongoose';

/** Add Expense POST */
export const addExpense = async (req, res) => {
try {
        const expense = await Tracker.create(req.body);
        res.status(201).json(expense);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/** Get All Expenses GET Request*/
export const getAllExpenses = async (req, res) => {
try {
        const expenses = await Tracker.find().sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/** Get Total Expenses GET request  */
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
        res.json({ total });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Get expenses by ID GET request
export const getExpenseById = async (req, res) => {
try {
        const expense = await Tracker.findById(req.params.id);
        if (!expense) return res.status(404).json({ error: 'Expense not found' });
        res.json(expense);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/** Filter by Category GET category  */
export const getByCategory = async (req, res) => {
try {
        const expenses = await Tracker.find({
        category: req.params.category
        });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/** READ: by date range (timezone-safe) */
export const getByDateRange = async (req, res) => {
    try {
        const { start, end } = req.query;

        if (!start || !end) {
        return res.status(400).json({ error: 'Start and end dates are required.' });
        }

        const startDate = new Date(start);
        const endDate = new Date(end);
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
        }

        // Add one day to endDate for exclusive comparison
        const nextDay = new Date(endDate);
        nextDay.setDate(nextDay.getDate() + 1);

        const expenses = await Expense.find({
        date: { $gte: startDate, $lt: nextDay }
        }).sort({ date: -1 });

        if (!expenses.length) {
        return res.status(404).json({ message: 'No expenses found in this date range.' });
        }

        res.json(expenses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error while fetching expenses.' });
    }
};

/** UPDATE an expense */
export const updateExpense = async (req, res) => {
try {
        const expense = await Tracker.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
        if (!expense) return res.status(404).json({ error: 'Expense not found' });
        res.json(expense);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/** DELETE an expense */
export const deleteExpense = async (req, res) => {
try {
        const expense = await Tracker.findByIdAndDelete(req.params.id);
        if (!expense) return res.status(404).json({ error: 'Expense not found' });
        res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};