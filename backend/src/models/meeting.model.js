import mongoose from "mongoose"

/*
  Ye meeting ka main collection hai.
  Isme sirf meeting ka existence + expiry store ho raha hai.
*/

const meetingSchema = new mongoose.Schema({

  meetingCode: {
    type: String,
    required: true,
    unique: true
  },

  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  expiresAt: {
    type: Date,
    required: true
  }

}, { timestamps: true })

export default mongoose.model("Meeting", meetingSchema)