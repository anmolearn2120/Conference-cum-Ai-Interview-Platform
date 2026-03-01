import API from "./axios";

// Signup
export const signupUser = (data) =>
  API.post("/api/auth/signup", data);

// Login with Password
export const loginWithPassword = (data) =>
  API.post("/api/auth/login/password", data);

// Send OTP
export const sendLoginOtp = (data) =>
  API.post("/api/auth/login/otp/send", data);

// Verify OTP
export const verifyLoginOtp = (data) =>
  API.post("/api/auth/login/otp/verify", data);