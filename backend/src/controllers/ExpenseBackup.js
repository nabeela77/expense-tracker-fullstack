import { ExpenseModel } from "../models/ExpenseSchema.js";
import { Parser } from "json2csv";
import ExcelJS from "exceljs";
import { Types } from "mongoose";

import multer from "multer";
import fs from "fs";
import path from "path";

//export
async function exportExpenses(req, res, next) {
  //https:.../?format
  try {
    const { format } = req.query;
    const userId = Types.ObjectId.createFromHexString(req.user.id);
    if (!["csv", "json", "xlsx"].includes(format)) {
      return res.status(400).json({ message: "Invalid export format" });
    }

    // Fetch expenses for logged in user only
    const expenses = await ExpenseModel.find({ userId });

    // Prepare data with required fields
    const data = expenses.map((e) => ({
      Amount: e.amount,
      Category: e.category,
      Date: e.date.toISOString().split("T")[0],
      Description: e.description || "",
    }));

    if (format === "json") {
      res.setHeader("Content-Type", "application/json"); //for setting type of data
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=expenses.json`
      ); // for making downloadable data
      return res.send(JSON.stringify(data, null, 2));
    }

    if (format === "csv") {
      const json2csv = new Parser({
        //debug
        fields: ["Amount", "Category", "Date", "Description"],
      });
      const csv = json2csv.parse(data);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename=expenses.csv`);
      return res.send(csv);
    }

    if (format === "xlsx") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Expenses");

      worksheet.columns = [
        { header: "Amount", key: "Amount", width: 15 },
        { header: "Category", key: "Category", width: 25 },
        { header: "Date", key: "Date", width: 15 },
        { header: "Description", key: "Description", width: 30 },
      ];

      data.forEach((item) => worksheet.addRow(item));

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=expenses.xlsx`
      );

      const buffer = await workbook.xlsx.writeBuffer();
      return res.send(buffer);
    }
  } catch (error) {
    console.error("Export error:", error);
    next(error);
  }
}
export default exportExpenses;

//import

const upload = multer({ dest: "uploads/" });

// Extract valid categories from Expense schema enum
const validCategories = new Set(
  ExpenseModel.schema.path("category").enumValues
);

export const importExpenses = [
  upload.single("uploadFile"), // middleware to handle file upload
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const userId = Types.ObjectId.createFromHexString(req.user.id);

      // 2️⃣ Extract file info
      const filePath = req.file.path;
      const fileExt = path.extname(req.file.originalname).toLowerCase();

      if (![".csv", ".json", ".xlsx"].includes(fileExt)) {
        fs.unlinkSync(filePath);
        return res.status(400).json({ message: "Unsupported file format" });
      }

      // Parse uploaded file
      let records = [];
      if (fileExt === ".csv") {
        records = await parseCSV(filePath);
      } else if (fileExt === ".json") {
        records = JSON.parse(fs.readFileSync(filePath, "utf8"));
      } else if (fileExt === ".xlsx") {
        records = await parseXLSX(filePath);
      }

      let imported = 0;
      let skipped = 0;
      const errors = [];
      const validEntries = [];

      // Validate each row
      for (let i = 0; i < records.length; i++) {
        const row = records[i];
        const rowNum = i + 2;

        const amount = parseFloat(row.amount || row.Amount);
        const category = (row.category || row.Category || "").trim();
        const date = new Date(row.date || row.Date);
        const description = row.description || row.Description || "";

        // --- Validation ---
        if (isNaN(amount) || amount <= 0) {
          errors.push(`Invalid amount on row ${rowNum}`);
          skipped++;
          continue;
        }
        if (isNaN(date.getTime())) {
          errors.push(`Invalid date on row ${rowNum}`);
          skipped++;
          continue;
        }
        if (!validCategories.has(category)) {
          errors.push(`Unknown category on row ${rowNum}`);
          skipped++;
          continue;
        }

        validEntries.push({ userId, amount, category, date, description });
      }

      // Insert valid entries into MongoDB
      if (validEntries.length) {
        await ExpenseModel.insertMany(validEntries);
        imported = validEntries.length;
      }

      // Clean up uploaded file
      fs.unlinkSync(filePath);

      return res.status(200).json({
        message: "Import completed successfully",
        imported,
        skipped,
        errors,
      });
    } catch (error) {
      console.error("Import error:", error);
      next(error);
    }
  },
];

// --- Helper Functions ---

function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csv.parse({ headers: true }))
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
}

async function parseXLSX(filePath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.worksheets[0];
  const rows = [];

  sheet.eachRow({ includeEmpty: false }, (row, rowNum) => {
    if (rowNum === 1) return; // skip header
    const [amount, category, date, description] = row.values.slice(1);
    rows.push({ amount, category, date, description });
  });

  return rows;
}
