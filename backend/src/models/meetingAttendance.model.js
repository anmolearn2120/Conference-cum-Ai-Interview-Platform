import mongoose from "mongoose";


const meetingAttendanceSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    meetingCode : {
        type : String,
        required : true
    },

    joinedAt : Date,

    leftAt : Date,

    duration : Number
    
},{timestamps : true});

export default mongoose.model("MeetingAttendance", meetingAttendanceSchema);