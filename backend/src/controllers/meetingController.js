import meetingModel from "../models/meeting.model.js";


import { transporter } from "../utils/mailer.js";


const generateMeetingCode = () => {
  return Math.random().toString(36).substring(2, 8)
}


// create new meeting

export const createMeeting = async (req , res) => {
    try {

        const meetingCode = generateMeetingCode();
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
        const meeting = await meetingModel.create({
            meetingCode : meetingCode,
            host : req.user._id,
            expiresAt : expiresAt
        })
        // send mail to host with meeting code
        await transporter.sendMail({
            from : process.env.EMAIL,
            to : req.user.email,
            subject : "Your Meeting Code",
            html: `
            <h2>Meeting Details</h2>
            <p><b>Code:</b> ${meetingCode}</p>
            <p><b>Expires:</b> ${expiresAt}</p>
            `
        })

        res.json({
            success : true,
            message : "Meeting Created Successfully",
            meetingCode,
            expiresAt
        })

    }

    catch (error)
    {
        console.log(error)
    res.status(500).json({ error: "Meeting creation failed" })
    }
}


// verify meeting code

export const verifyMeeting = async (req , res) => {
    try{
        const { meetingcode }  = req.params
        const meeting = await meetingModel.findOne({ meetingCode: meetingcode });

        if(!meeting)
             return res.status(404).json({ error : "Meeting not found" })
        
        if(meeting.expiresAt < new Date())
             return res.status(400).json({ error : "Meeting Expired" })
        
        res.json({
            success : true,
            message : "Meeting Verified Successfully",
            meetingCode : meeting.meetingCode,
            expiresAt : meeting.expiresAt
        });

    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({ error: "Meeting verification failed" })
    }
}
