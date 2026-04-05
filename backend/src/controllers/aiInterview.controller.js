import AIInterview from "../models/aiInterview.model.js";
import Resume from "../models/resume.model.js";
import { transporter } from "../utils/mailer.js";
import { generateInterviewQuestion, generateInterviewScore } from "../services/interviewService.js";



//generate ai interview code
const generateAiCode = () => {
  return Math.random().toString(36).substring(2, 8);
}

/* =====================================================
   CREATE AI INTERVIEW
===================================================== */
export const createAIInterview = async (req, res) => {
  try {
    if (req.user.role !== "interviewer" && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Upgrade plan to create AI interview",
      });
    }

    const { jobRole, note } = req.body;
    const aiCode = generateAiCode();
    // 7 days = 7 din * 24 ghante * 60 minute * 60 second * 1000 milliseconds
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const interview = await AIInterview.create({
      aiCode,
      expiresAt,
      interviewer: req.user._id,
      jobRole,
      note,
      status: "created",
    });

    // send mail to host with meeting code
    await transporter.sendMail({
      from: '"Meet App AI" <anmolearn2120@gmail.com>',
      to: req.user.email,
      subject: "Your AI Interview Code",
      html: `
                <h2>Meeting Details</h2>
                <p><b>Code:</b> ${aiCode}</p>
                <p><b>Expires:</b> ${expiresAt}</p>
                <p>Share this code with your candidate to start the AI interview.</p>
                `,
    });

    res.status(201).json({
      message: "AI Interview Created",
      aiCode,
      interviewId: interview._id,
    });
  } catch (error) {
    console.error("CREATE AI INTERVIEW ERROR:", error);
    res.status(500).json({ message: "Failed to create AI interview" });
  }
}


/* =====================================================
   VERIFY AI INTERVIEW CODE
===================================================== */
export const verifyAIInterview = async (req,res) => {
  try {
    const { aiCode } = req.params;
    const interview = await AIInterview.findOne({ aiCode }).populate(
      "interviewer",
      "name email",
    );

    if(!interview)
       return res.status(404).json({message : "Invalid AI Interview Code"});

    if (
      interview.candidate &&
      interview.candidate.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Interview already assigned to another candidate",
      });
    }
    
      if(interview.status === "completed")
        return res.status(400).json({message : "Interview already completed"});
    if (!interview.candidate) {
      interview.candidate = req.user._id;
      await interview.save();
    }
    res.status(200).json({
      message : "AI Interview Code Verified",
      interviewId : interview._id,
        jobRole : interview.jobRole,
        interviewer : interview.interviewer,
        status : interview.status,

    });
  } catch (error) {
     console.error("VERIFY AI INTERVIEW ERROR:", error);
    res.status(500).json({ message: "Failed to verify AI interview code" });
  }
}


export const getCreatedAIInterviews = async (req,res) => {
    try {
      if (req.user.role !== "interviewer" && req.user.role !== "admin")
        return res.status(403).json({ message: "Access Denied" });

      const interviews = await AIInterview.find({
        interviewer: req.user._id,
      })
        .populate("candidate", "name email")
        .sort({ createdAt: -1 });

      //  Format response cleanly
      const formatted = interviews.map((interview) => ({
        interviewId: interview._id,
        aiCode: interview.aiCode,
        jobRole: interview.jobRole,
        note: interview.note || "-",
        status: interview.status,
        createdAt: interview.createdAt,

        candidate: interview.candidate
          ? {
              name: interview.candidate.name,
              email: interview.candidate.email,
            }
          : "-", // Not attended yet

        score: interview.score
          ? {
              technical: interview.score.technical,
              communication: interview.score.communication,
              overall: interview.score.overall,
              feedback: interview.score.feedback,
            }
          : "-", // Not completed yet
      }));


      res.status(200).json(formatted);


    } catch (error) {
        console.error("GET CREATED INTERVIEWS ERROR:", error);
        res.status(500).json({ message: "Failed to fetch interviews" });
    }
};


export const getCandidateAIInterviews = async (req, res) => {
  try {
    const interviews = await AIInterview.find({
      candidate: req.user._id,
    })
      .populate("interviewer", "name email")
      .sort({ createdAt: -1 });

    const formatted = interviews.map((interview) => ({
      interviewId: interview._id,
      aiCode: interview.aiCode,
      jobRole: interview.jobRole,
      note: interview.note || "-",
      status: interview.status,
      createdAt: interview.createdAt,

      interviewer: interview.interviewer
        ? {
            name: interview.interviewer.name,
            email: interview.interviewer.email,
          }
        : "-",

      score: interview.score
        ? {
            technical: interview.score.technical,
            communication: interview.score.communication,
            overall: interview.score.overall,
            feedback: interview.score.feedback,
          }
        : "-",
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch activity" });
  }
};



