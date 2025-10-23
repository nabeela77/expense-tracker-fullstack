import { UserModel } from "../models/UserSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Joi from "@hapi/joi";

const loginSchema = Joi.object({
  email: Joi.string().min(6).lowercase().required().email(),
  password: Joi.string()
    .min(8)
    .pattern(
      new RegExp('^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$')
    )
    .required(),
});

export const loginUser = async (req, res) => {
  try {
    const result = await loginSchema.validateAsync(req.body, {
      abortEarly: false,
    });
    const { email, password } = result;
    const user = await UserModel.findOne({ email }).select("+passwordHash");
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    // res.send("Logged In");
    // console.log("loggedin");
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({ token: `Bearer ${token}` });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({
        message: "Validation failed",
      });
    }
    // console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
