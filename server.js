import express from 'express';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import trackerRoutes from './routes/trackerRoute.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/expenses', trackerRoutes);

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/expense-tracker';


const startServer = async () => {
    try {
        await connectDB(MONGO_URI);
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();