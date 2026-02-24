import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
title: {
    type: String,
    required: true,
    trim: true
},
amount: {
    type: Number,
    required: true,
    min: 0
},
category: {
    type: String,
    required: true,
    enum: ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Other"]
},
date: {
    type: Date,
    default: Date.now
}
}, { timestamps: true });

const Tracker = mongoose.model("Expense", expenseSchema);

export default Tracker;