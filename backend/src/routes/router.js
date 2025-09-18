import { Router } from "express";
import {
  getExpense,
  getCategories,
  getSummary,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../controllers/expenses.js";
const router = Router();

router.get("/", getExpense);
router.post("/", createExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);
router.get("/summary", getSummary);
router.get("/categories", getCategories);
export default router;
