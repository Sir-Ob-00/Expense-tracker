import express from 'express';
import { 
    addExpense,
    getAllExpenses,
    getExpenseById,
    getTotalExpenses,
    getByCategory,
    getByDateRange,
    updateExpense,
    deleteExpense
} from '../controller/trackerController.js';

const router = express.Router();

router.post('/', addExpense);
router.get('/', getAllExpenses);
router.get('/date', getByDateRange);
router.get('/total', getTotalExpenses);
router.get('/category/:category', getByCategory);
router.get('/:id', getExpenseById);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;

