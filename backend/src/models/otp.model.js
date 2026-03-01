import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
    },
    otp : {
        type : String,
        required : true,    
    },
    expiresAt : {
        type : Date,
        required : true,
        index : { expires : 300 } // this will automatically delete the document after 5 minutes (300 seconds)
    }
})

export const OTP = mongoose.model('OTP', otpSchema);