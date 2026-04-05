import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"

export const protect = async (req, res, next) => {

  let token

  // Authorization header check
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]
  }

  if (!token) {
    return res.status(401).json({ error: "Not authorized" })
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // User DB se nikalo
    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(401).json({ error: "User not found" })
    }

    // IMPORTANT LINE
    req.user = user

    next()

  } catch (error) {
    return res.status(401).json({ error: "Token invalid" })
  }

}

export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" })
  }

  next()
}
