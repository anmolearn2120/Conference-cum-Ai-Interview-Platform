import { Router } from "express";
import { sendLoginOtp,verifyLoginOtp, LoginwithPassword, signup } from "../controllers/authController.js";
import { protect } from "../middlewares/auth.js";

const router = Router();

// /**
//  * @swagger
//  * /api/users:
//  *   get:
//  *     summary: Get all users
//  *     description: Returns list of users
//  *     responses:
//  *       200:
//  *         description: Success
//  */

// route for registering a new user
router.post("/signup", signup);
router.post("/login/password", LoginwithPassword);
router.post("/login/otp/send", sendLoginOtp);
router.post("/login/otp/verify", verifyLoginOtp);

// router.post("/activity", authMiddleware, addToActivity);
// router.get("/activity", authMiddleware, getAllActivity);

export default router;