import { Router } from "express";

import { loginUser } from "../controllers/LoginController.js";

export const loginRouter = Router();

loginRouter.post("/login", loginUser);
