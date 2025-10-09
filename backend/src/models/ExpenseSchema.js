import { Schema, model, Types } from "mongoose";

const expenseTrackerSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      required: true,
      ref: "UserModel",
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Rent",
        "Groceries",
        "Utilities",
        "Insurance",
        "Food",
        "Shopping",
        "Others",
      ],
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
  },
  // {
  //   timestamps: true,
  // },
  {
    versionKey: false, // disables __v
  }
);

// expenseTrackerSchema.set("toJSON", {
//   transform: function (doc, ret) {
//     // Format the date
//     ret.date = new Date(ret.date)
//       .toISOString()
//       .replace("T", " ")
//       .replace("Z", "")
//       .slice(0, 19);

//     // Add id and remove internal fields
//     ret.id = ret._id.toString();
//     delete ret._id;
//     delete ret.__v;

//     return ret;
//   },
// });

// Create model
expenseTrackerSchema.set("toJSON", {
  transform: function (doc, ret) {
    // Format the date to local time
    const localDate = new Date(ret.date).toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    // Convert to format: YYYY-MM-DD HH:mm:ss
    const [datePart, timePart] = localDate.split(", ");
    const [day, month, year] = datePart.split("/");
    ret.date = `${year}-${month}-${day} ${timePart}`;

    // Add id and remove internal fields
    ret.id = ret._id.toString();
    ret.userId = ret.userId.toString();
    delete ret._id;
    delete ret.__v;

    return ret;
  },
});

export const ExpenseModel = model("Expense", expenseTrackerSchema);
