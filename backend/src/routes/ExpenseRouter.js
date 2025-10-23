import { Router } from "express";
import {
  getExpense,
  getCategories,
  getSummary,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../controllers/expenses.js";
import exportExpenses from "../controllers/ExpenseBackup.js";
import { importExpenses } from "../controllers/ExpenseBackup.js";
import { auth } from "../middlewares/authMiddleware.js";
const expenseRouter = Router();

expenseRouter.get("/", auth, getExpense);
expenseRouter.post("/", auth, createExpense);
expenseRouter.put("/:id", auth, updateExpense);
expenseRouter.delete("/:id", auth, deleteExpense);
expenseRouter.get("/summary", auth, getSummary);
expenseRouter.get("/categories", auth, getCategories);
expenseRouter.get("/export", auth, exportExpenses);

expenseRouter.post("/import", auth, importExpenses);
export default expenseRouter;
