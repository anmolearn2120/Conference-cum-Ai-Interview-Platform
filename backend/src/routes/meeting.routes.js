import { createMeeting, verifyMeeting } from "../controllers/meetingController.js";
import { Router } from "express";
import { protect } from "../middlewares/auth.js";


const router = Router();

router.post("/create", protect , createMeeting);
router.get("/verify/:meetingcode",protect, verifyMeeting);

export default router;