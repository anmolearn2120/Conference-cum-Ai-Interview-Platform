import { useContext , useState } from "react";
import { useNavigate , Link } from "react-router-dom";
import "./Signup.css";

import { loginWithPassword, sendLoginOtp , verifyLoginOtp } from "../api/auth";
import { AuthContext } from "../context/AuthContext";


export default function Login() {

  const navigate = useNavigate();
  const [formData , setformData] = useState({
    email : "",
    password : "",
    otp : ""

  });

  const [isotpmode , setisotpmode] = useState(false);
  const [otpsent , setotpsent] = useState(false);
  const [loading , setloading] = useState(false);
  const [error, seterror] = useState("");
  const {login} = useContext(AuthContext);

  const handleChange = (e) => {
    setformData({
      ...formData,
      [e.target.name] : e.target.value
    });
  }

  const handleloginwithPassword = async (e) => {
    e.preventDefault();
    setloading(true);
    seterror("");
    try{
      const response = await loginWithPassword({
        email : formData.email,
        password : formData.password
      })

      login(response.data);
      navigate("/dashboard");

    }
    catch(err)
    {
      seterror(err.response?.data?.message || " Login With Password Failed ");
    }

    setloading(false);
  }

  const handleSendOtp = async ()=> {

    setloading(true);
    seterror("");

    try{
      await sendLoginOtp({
        email : formData.email
      })

      setotpsent(true);


    }
    catch(err)
    {
      seterror(err.response?.data?.message || "Send OTP Failed");
    }
    setloading(false);
  }


  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setloading(true);
    seterror("");
    try {

      const response = await verifyLoginOtp({
        email : formData.email,
        otp : formData.otp
      })

      login(response.data);
      navigate("/dashboard");
      
    } catch (err) {
      seterror(err.response?.data?.message || "OTP verification Failed");
      
    }
    setloading(false);
  }

  return (


    <div className="auth-container">
      <div className="auth-card">
        <h2>
          Login
        </h2>
        {error && <p className="error-text">{error}</p>}

        {/* /* Login with Password Form *//* */}
        {!isotpmode && (
          <form onSubmit={handleloginwithPassword}>
            <input
              name="email"
              type="email"
              placeholder="abc@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              />

              <input
               type="password"
               name="password"
               placeholder="password"
               value={formData.password}
               onChange={handleChange}
               required
               />

               {/* Action Links */}
               <div className="auth-links">
                <span className="forgot-link">
                  Forgot Password ?🤦‍♂️ 
                </span>
                <span 
                className="otp-link"
                onClick={()=> setisotpmode(true)}
                >
                  Login With OTP👌
                </span>
               </div>
              <button disabled={loading}>
                {loading? "Logging in..." : "Login" }
              </button>
          </form>
        )}

        {/* login with otp */}
        {isotpmode && (
          <>
          {!otpsent ? (
            <>
            <input 
            name="email"
            type="email"
            placeholder="abc@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            />
            <button onClick={handleSendOtp} disabled={loading}>
              {loading? "Sending Otp..." : "Send OTP"}
            </button>
            <p
              className="opt-link"
              onClick={()=>{
                setisotpmode(false);
                setotpsent(false);
              }}>
                Back to Password Login😏
              </p>

            </>
          ):(
            <>
            <form onSubmit={handleVerifyOtp}>
              <input
               type="otp"
               name="otp"
               placeholder="Enter OTP"
               value={formData.otp}
               onChange={handleChange}
               required
               />

               <button disabled={loading}>
                {loading ? "Verifiying..." : "Verify OTP"}
               </button>


            </form>
            </>
          )}



          </>

        )}

        <p className="switch-text">
          Don't Have an account <Link to="/signup">Signup </Link>

        </p>

      </div>
    </div>
  );
}
