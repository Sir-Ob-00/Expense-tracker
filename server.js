import express from 'express';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import trackerRoutes from './routes/trackerRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
app.use(express.json());

// ---------------- STATIC FILES ----------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/expenses', trackerRoutes);

// ---------------- CATCH-ALL ROUTE ----------------
// Serve frontend for any non-API route (SPA)
app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

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