import express from "express";
import { SignUpUser } from "../controllers/SignUpController.js";

export const SignUpRouter = express.Router();

SignUpRouter.post("/signup", SignUpUser);
