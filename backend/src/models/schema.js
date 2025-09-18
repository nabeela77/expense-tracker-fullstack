import { Schema, model } from "mongoose";

const expenseTrackerSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "rent",
        "groceries",
        "utilities",
        "insurance",
        "food",
        "shopping",
        "others",
      ],
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

expenseTrackerSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

// Create model

export const ExpenseModel = model("Expense", expenseTrackerSchema);
