import { useContext , useState,  } from "react";

import "./Signup.css";
import { useNavigate, Link } from "react-router-dom";

import { signupUser } from "../api/auth";


import { AuthContext } from "../context/AuthContext";

export default function Signup() {

  const [formData , setformData] = useState({
    name : "",
    username : "",
    email : "",
    password : ""
  });
  const [loading , setloading] = useState(false);

  const [error, seterror] = useState("");
  const navigate = useNavigate();



  const {login} = useContext(AuthContext);

  const handleChange =(e) => {
    setformData({
      ...formData,
      [e.target.name] : e.target.value
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setloading(true);
    seterror("");

    try{

      const response = await signupUser(formData);
      const data = response.data;

      login(data);
      navigate("/dashboard");

    }
    catch(err)
    {
      seterror(err.response?.data?.message || "Signup Failed"); 

    }
    setloading(false);
  }


  return (
    <div className="root">
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        {error && <p className="error-text">{error}</p>}
        < form onSubmit={handleSubmit} >


        <input 
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
        />

        <input 
        type="text"
        name="username"
        placeholder="username"
        value={formData.username}
        onChange={handleChange}
        required
        
        />

        <input 
        type="email"
        name="email"
        placeholder="abc@example.com"
        value={formData.email}
        onChange={handleChange}
        required
        />

        <input 
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating Acount..." : "Signup"}
        </button>
        </form>

        <p className="switch-text">
          Already Have an Account <Link to="/login">Login </Link> </p>
      </div>
    </div>
    </div>
  );
}

