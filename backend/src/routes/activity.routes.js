import { protect } from "../middlewares/auth.js";
import express from "express";
import meetingAttendanceModel from "../models/meetingAttendance.model.js";

const router = express.Router();

router.post("/myactivity" , protect , async(req, res) => {
    const activity = await meetingAttendanceModel.find({
        user : req.user._id,
    }).sort({ createdAt : -1 });

    res.json(activity);
})


export default router;