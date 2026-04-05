// import swaggerUi from "swagger-ui-express";
// import swaggerSpec from "./src/config/swagger.js";
import dotenv from "dotenv";
dotenv.config();

import { connectToSocket } from "./src/controllers/socketManager.js";
import express from "express";
import cors from "cors";

import { createServer } from "node:http";
import { Server } from "socket.io";

import { connectDB } from "./src/config/db.js";


import router from "./src/routes/users.routes.js";

import userRoutes from "./src/routes/users.routes.js";

import resumeRoutes from "./src/routes/resume.routes.js";
import aiInterviewRoutes from "./src/routes/aiInterview.routes.js";

import meetingRoutes from "./src/routes/meeting.routes.js";
import activityRoutes from "./src/routes/activity.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import { transporter } from "./src/utils/mailer.js";
import AIInterview from "./src/models/aiInterview.model.js";
import Resume from "./src/models/resume.model.js";
import { generateInterviewScore } from "./src/services/interviewService.js";
import  parseScore  from "./src/utils/parseScore.js";
import { protect } from "./src/middlewares/auth.js";
import { requestFreeAccess } from "./src/controllers/authController.js";

const app = express();

const server = createServer(app);

const io = connectToSocket(server);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Default fallback
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const port = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use("/api/auth", userRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/admin", adminRoutes);


app.use("/api/ai", aiInterviewRoutes);
app.post("/request-free-access", protect, requestFreeAccess);

//console.log("MONGO_URI:", MONGO_URI); // Debugging line to check if MONGO_URI is loaded

const startServer = async () => {
  connectDB(MONGO_URI);
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);

    transporter.verify((err, success) => {
      if (err) console.log("SMTP ERROR:", err);
      else console.log("SMTP READY");
    });

    /* ======================================
     AUTO COMPLETE CHECKER
  ====================================== */
setInterval(async () => {
  try {

    const expired = await AIInterview.find({
      status: "active",
      autoCompleteAt: { $lt: new Date() },
    });

    for (const interview of expired) {

      const resume = await Resume.findOne({
        user: interview.candidate,
      });

      if (!resume) continue;

      const scoreText = await generateInterviewScore({
        summary: resume.summary,
        questions: interview.questions,
      });

      interview.score = parseScore(scoreText);
      interview.status = "completed";
      interview.autoCompleteAt = null;

      await interview.save();

      console.log("Auto completed interview:", interview._id);
    }

  } catch (err) {
    console.error("Auto completion error:", err);
  }

}, 60000); // every 1 minute




  });


};

startServer();
