// import { Request, Response, NextFunction } from "express";
import { ExpenseModel } from "../models/schema.js";

export async function getExpense(_req, res, next) {
  try {
    const docs = await ExpenseModel.find();
    res.json(docs);
  } catch (err) {
    next(err);
  }
}

export async function createExpense(req, res, next) {
  try {
    const newExpense = new ExpenseModel(req.body);
    const saved = await newExpense.save();
    res.status(201).json(saved);
  } catch (err) {
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
  try {
    const categories = [
      "rent",
      "groceries",
      "utilities",
      "insurance",
      "food",
      "shopping",
      "others",
    ];
    res.json(categories);
  } catch (err) {
    next(err);
  }
}
