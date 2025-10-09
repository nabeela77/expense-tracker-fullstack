// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

export function auth(req, res, next) {
  //   console.log("Headers:", req.headers);
  const authHeader = req.header("Authorization");
  //   console.log("Authorization header:", authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access Denied: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // get raw token

  try {
    const verified = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = { id: verified.userId };
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid token" });
  }
}
