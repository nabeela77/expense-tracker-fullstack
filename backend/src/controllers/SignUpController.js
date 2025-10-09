import { UserModel } from "../models/UserSchema.js";
import bcrypt from "bcrypt";
import Joi from "@hapi/joi";

const signupSchema = Joi.object({
  email: Joi.string().min(6).lowercase().required().email(),
  password: Joi.string()
    .min(8)
    .pattern(
      new RegExp('^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$')
    )
    .required(),
  confirmPassword: Joi.any().valid(Joi.ref("password")).required(),
});

export const SignUpUser = async (req, res) => {
  try {
    const result = await signupSchema.validateAsync(req.body, {
      abortEarly: false,
    });
    const { email, password } = result;
    // if (!email || typeof email !== "string" || email.trim() === "") {
    //   return res.status(400).json({ message: "Email is required." });
    // }
    // if (!password || typeof password !== "string" || password.trim() === "") {
    //   return res.status(400).json({ message: "Password is required." });
    // }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // const newUser = new UserModel({ email });
    // newUser.password = password;

    // await newUser.save(); // we can use this when using schema.pre

    const passwordStr = String(password);
    const passwordHash = await bcrypt.hash(passwordStr, 10);

    const newUser = new UserModel({
      //can use .create too
      email,
      passwordHash,
    });

    await newUser.save();
    // also can check if user is created by findbyid

    res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({
        message: "Validation failed",
      });
    }

    // console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during signup." });
  }
};
