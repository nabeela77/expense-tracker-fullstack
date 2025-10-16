// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

export function auth(req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access Denied: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract token

  try {
    const verified = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = { id: verified.userId };
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // 🔥 Notify frontend that token expired
      res.setHeader("Token-Expired", "true");
      return res
        .status(401)
        .json({ message: "Session expired. Please login again." });
    }

    return res.status(400).json({ message: "Invalid token" });
  }
}
