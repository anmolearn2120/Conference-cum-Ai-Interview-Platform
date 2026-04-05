import { User } from "../models/user.model.js";
import { OAuth2Client } from "google-auth-library";


import { OTP } from "../models/otp.model.js";
// import { createTransporter } from "../utils/mailer.js";
import { transporter } from "../utils/mailer.js";

import jwt from "jsonwebtoken";

// generate auth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//generate otp

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// generate jwt token

const generateToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    // check if user already exists
    const exist = await User.findOne({ email });
    if (exist)
      return res
        .status(400)
        .json({ message: "User Already Exists, Please Login" });

    // create new user
    const user = await User.create({
      name,
      username,
      email,
      password,
    });

    const token = generateToken(user);
    res.status(201).json({
      message: "User Created Successfully",
      token,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup Failed" });
  }
};

export const LoginwithPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if user exists

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User Not Found, Please Signup" });

    if (!user.hasLoginAccess) {
      return res.status(403).json({ message: "Your email does not have login access" });
    }

    // check password

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    // now we know that user is authenticated, we will generate a token for the user
    const token = generateToken(user);
    res.status(200).json({
      message: "Login Successful",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Login with Password Failed" });
  }
};

export const sendLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;
    // check if user exists

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User Not Found, Please Signup" });

    if (!user.hasLoginAccess) {
      return res.status(403).json({ message: "Your email does not have login access" });
    }

    // generate opt for the user
    const otp = generateOtp();

    // save this otp in database for comparison later,
    // we will set the expiry time for this otp as 5 minutes

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.deleteMany({ email });
    // ye imp line hai kyuki agar user ne multiple times
    // otp generate karne ki koshish ki toh purane otp ko
    // delete kar dega aur sirf latest otp valid rahega

    await OTP.create({
      email: email,
      otp: otp,
      expiresAt: expiresAt,
    });

    // now we will send the otp to the user's email

    // console.log("Generated OTP:", otp); // Debugging line to check if OTP is generated correctly
    // console.log("Sending OTP to:", email); // Debugging line to check if email is correct
    // console.log(process.env.EMAIL, process.env.EMAIL_PASS); // Debugging line to check if email credentials are loaded
    //const transporter = createTransporter(); // Create transporter instance

    await transporter.sendMail({
      from: '"Meet App" <anmolearn2120@gmail.com>',
      to: email,
      subject: `Your OTP for Login is ${otp}`,
      text: `Your OTP for Login is ${otp}. This OTP is valid for 5 minutes.`,
    });

    res.status(200).json({ message: "OTP Sent to Email Successfully" });
  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    res.status(500).json({ message: "Send OTP Failed", error: err.message });
  }
};

export const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    // check if otp is valid
    const record = await OTP.findOne({ email });
    if (!record)
      return res
        .status(400)
        .json({ messsage: "OTP Expired, Please Request for OTP Again" });

    if (record.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP, Please Try Again" });

    const user = await User.findOne({ email });

    if (!user || !user.hasLoginAccess)
      return res.status(403).json({ message: "Your email does not have login access" });

    await OTP.deleteOne({ email }); // ye line isliye hai kyuki
    // ek baar otp verify ho jaye toh us otp ko database
    // se delete kar dena chahiye taki wo dobara use na ho sake

    const token = generateToken(user);

    res.status(200).json({
      message: "Login Successful",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Verify OTP Failed" });
  }
};


//google login and signup
export const googleLogin = async (req, res) => {
  try {

    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, sub } = payload;
    let user = await User.findOne({
      $or: [{ email }, { googleId: sub }],
    });

    if (!user) {
      user = await User.create({
        name,
        email,
        username: email.split('@')[0],
        provider: 'google',
        googleId: sub,
        isVerified: true
      });

    }
    else {
      if (!user.hasLoginAccess) {
        return res.status(403).json({ message: "Your email does not have login access" });
      }

      // 🔵 LOGIN (existing user)

      // agar pehle local account tha → upgrade kar
      if (user.provider === "local") {
        user.provider = "google";
        user.googleId = sub;
        user.isVerified = true;
        await user.save();
      }
    }

    res.status(200).json({
      message: "Google Login Successful",
      token: generateToken(user),
      user,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Google Login Failed" });
  }
}

export const requestFreeAccess = async (req, res) => {
  try {
    const { name, email, purpose } = req.body;

    if (!name || !email || !purpose) {
      return res.status(400).json({ message: "Name, email and purpose are required" });
    }

    if (!req.user?.isNewUser) {
      return res.status(409).json({ message: "Free access request already submitted" });
    }

    await transporter.sendMail({
      from: '"Meet App" <anmolearn2120@gmail.com>',
      to: "anmolearn2120@gmail.com",
      subject: "New Free Interview Access Request",
      text: `Free interview request received.\n\nName: ${name}\nEmail: ${email}\nPurpose: ${purpose}`,
    });

    if (req.user?.isNewUser) {
      req.user.isNewUser = false;
      await req.user.save();
    }

    return res.status(200).json({ message: "Request submitted successfully" });
  } catch (err) {
    console.error("REQUEST FREE ACCESS ERROR:", err);
    return res.status(500).json({ message: "Request free access failed" });
  }
};