import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import router from "./routes/router.js";

export const app = express();
app.use(cors());
app.use(express.json());

// Health Check
app.get("/health", (req, res) => {
  const mongoState = mongoose.connection.readyState;
  res.json({
    status: "ok",
    mongo: mongoState === 1 ? "connected" : "not-connected",
  });
});

app.use("/api/expenses", router);

app.use((_req, res, _next) => {
  res.status(404).json({ error: "endpoint not found" });
});

// error handler

app.use((err, _req, res, _next) => {
  console.error(err);
  if (err?.name === "ValidationError")
    return res
      .status(400)
      .json({ error: "validation  failure", details: err.message });
  if (err?.name === "NotFound")
    return res.status(404).json({ error: err.message });

  res.status(500).json({ error: "Internal server errors" });
});
