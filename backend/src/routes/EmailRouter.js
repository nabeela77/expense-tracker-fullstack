import { UserModel } from "../models/UserSchema.js";
import nodemailer from "nodemailer";
import { Router } from "express";
import "dotenv/config";

const EmailRouter = Router();

EmailRouter.post("/forgot-password", async (req, res) => {
  const { recipient_email, OTP } = req.body;

  if (!recipient_email || !OTP) {
    return res.status(400).json({ message: "Missing recipient_email or OTP" });
  }

  try {
    // Step 1: Try to find sender user with email credentials
    let sender = await UserModel.findOne({ canSendEmail: true }).select(
      "+emailPassword"
    );

    // Step 2: If not found, create one from .env
    if (!sender) {
      const { MY_EMAIL, MY_PASSWORD } = process.env;

      if (!MY_EMAIL || !MY_PASSWORD) {
        console.error("❌ Missing MY_EMAIL or MY_PASSWORD in .env");
        return res
          .status(500)
          .json({ message: "Email credentials not configured" });
      }

      sender = await UserModel.findOneAndUpdate(
        { email: MY_EMAIL },
        {
          email: MY_EMAIL,
          emailPassword: MY_PASSWORD,
          canSendEmail: true,
        },
        { upsert: true, new: true }
      ).select("+emailPassword");

      console.log("✅ Auto-created sender user:", sender.email);
    }

    // Step 3: Check if sender and credentials exist
    if (!sender || !sender.emailPassword) {
      console.error("❌ Sender not found or missing emailPassword");
      return res
        .status(500)
        .json({ message: "Sender email credentials not found" });
    }

    // Step 4: Configure transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: sender.email,
        pass: sender.emailPassword,
      },
    });

    // Optional: Verify connection
    await transporter.verify();

    // Step 5: Send email
    const mailOptions = {
      from: sender.email,
      to: recipient_email,
      subject: "KODING 101 PASSWORD RECOVERY",
      html: `<h2>Your OTP is: ${OTP}</h2>`,
    };

    await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent to ${recipient_email}`);
    res.json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("❌ Error in /forgot-password route:", err);
    res.status(500).json({ message: err.message || "Internal server error" });
  }
});
export default EmailRouter;
