// import { Request, Response, NextFunction } from "express";
import { ExpenseModel } from "../models/ExpenseSchema.js";
import { Types } from "mongoose";
export async function getExpense(req, res, next) {
  try {
    const docs = await ExpenseModel.find({ userId: req.user.id });
    res.json(docs);
  } catch (err) {
    next(err);
  }
}

export async function createExpense(req, res, next) {
  try {
    const { amount, description = "", category, date } = req.body;
    const amountNum = Number(amount);

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    if (isNaN(amountNum)) {
      return res.status(400).json({ message: "Amount must be a number" });
    }

    if (!date || isNaN(Date.parse(date))) {
      return res.status(400).json({ message: "Valid date is required" });
    }

    // Convert string user id to ObjectId correctly:
    const userId = Types.ObjectId.createFromHexString(req.user.id);

    const newExpense = new ExpenseModel({
      userId,
      amount: amountNum,
      description,
      category,
      date: new Date(date),
    });

    const saved = await newExpense.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation failed", details: err.errors });
    }
    next(err);
  }
}

export async function updateExpense(req, res, next) {
  try {
    const updated = await ExpenseModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteExpense(req, res, next) {
  try {
    const deleted = await ExpenseModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function getSummary(req, res, next) {
  try {
    const summary = await ExpenseModel.aggregate([
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: { $toDouble: "$amount" } },
          expenses: { $push: "$$ROOT" },
        },
      },
    ]);
    res.json(summary);
  } catch (err) {
    next(err);
  }
}

export async function getCategories(req, res, next) {
  console.log("Headers:", req.headers);
  console.log("User ID from token:", req.user?.id);
  try {
    const categories = [
      "Rent",
      "Groceries",
      "Utilities",
      "Insurance",
      "Food",
      "Shopping",
      "Others",
    ];
    res.json(categories);
  } catch (err) {
    next(err);
  }
}
