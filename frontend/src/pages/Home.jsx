// import "./Home.css";
// import { motion, useMotionValue, useTransform } from "framer-motion";
// import { useNavigate } from "react-router-dom";

// function Home() {
//   const navigate = useNavigate();

//   /* ---------------- PARALLAX SETUP ---------------- */
//   const x = useMotionValue(0);
//   const y = useMotionValue(0);

//   const rotateX = useTransform(y, [-200, 200], [10, -10]);
//   const rotateY = useTransform(x, [-200, 200], [-10, 10]);

//   const handleMouseMove = (e) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     x.set(e.clientX - rect.left - rect.width / 2);
//     y.set(e.clientY - rect.top - rect.height / 2);
//   };

//   const resetTilt = () => {
//     x.set(0);
//     y.set(0);
//   };

//   return (
//     <div className="outer-bg">
      
//       {/* ================= HERO SECTION ================= */}
//       <section className="hero-wrapper">

//         <motion.div
//           className="hero-card"
//           style={{ rotateX, rotateY }}
//           onMouseMove={handleMouseMove}
//           onMouseLeave={resetTilt}
//           initial={{ opacity: 0, y: 60 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//         >

//           {/* Floating Gradient Blobs */}
//           <div className="blob blob1"></div>
//           <div className="blob blob2"></div>

//           {/* ---------------- NAVBAR ---------------- */}
//           <nav className="nav">
//             <div className="logo">MeetSphere</div>

//             <div className="nav-links">
//               <a href="#">Home</a>
//               <a href="#features">Features</a>
//               <a href="#ai">AI Interview</a>
//               <a href="#contact">Contact</a>
//             </div>

//             <div className="nav-buttons">
//               <button
//                 className="signup"
//                 onClick={() => navigate("/signup")}
//               >
//                 Sign Up
//               </button>

//               <button
//                 className="login"
//                 onClick={() => navigate("/login")}
//               >
//                 Login
//               </button>
//             </div>
//           </nav>

//           {/* ---------------- HERO CONTENT ---------------- */}
//           <div className="hero-content">

//             <motion.div
//               className="left"
//               initial={{ x: -80, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ delay: 0.3 }}
//             >
//               <h1>AI Powered Video Conferencing</h1>

//               <p>
//                 Conduct seamless meetings or switch to AI Interview mode.
//                 Real-time chat, attendance tracking and adaptive questioning —
//                 all in one intelligent platform.
//               </p>

//               <div className="buttons">
//                 <button className="btn-primary">
//                   Get Started
//                 </button>

//                 <button className="btn-secondary">
//                   Explore
//                 </button>
//               </div>
//             </motion.div>

//             <motion.div
//               className="right"
//               initial={{ x: 80, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ delay: 0.5 }}
//             >
//               {/* Put your SVG inside public folder */}
//               <img
//                 src="/illustration.svg"
//                 alt="Video Illustration"
//                 className="hero-img"
//               />
//             </motion.div>

//           </div>
//         </motion.div>
//       </section>


//       {/* ================= FEATURES SECTION ================= */}
//       <motion.section
//         id="features"
//         className="features-section"
//         initial={{ opacity: 0, y: 80 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         viewport={{ once: true }}
//       >
//         <h2>Why MeetSphere?</h2>

//         <div className="feature-grid">

//           <motion.div
//             className="feature-card"
//             whileHover={{ scale: 1.05 }}
//           >
//             <h3>HD Video Calls</h3>
//             <p>
//               Powered by WebRTC for ultra-clear, low-latency meetings.
//             </p>
//           </motion.div>

//           <motion.div
//             className="feature-card"
//             whileHover={{ scale: 1.05 }}
//           >
//             <h3>Real-time Chat</h3>
//             <p>
//               Instant messaging integrated directly into meeting rooms.
//             </p>
//           </motion.div>

//           <motion.div
//             className="feature-card"
//             whileHover={{ scale: 1.05 }}
//           >
//             <h3>Attendance Tracking</h3>
//             <p>
//               Automatic session logs and activity monitoring.
//             </p>
//           </motion.div>

//         </div>
//       </motion.section>


//       {/* ================= AI INTERVIEW SECTION ================= */}
//       <motion.section
//         id="ai"
//         className="ai-section"
//         initial={{ opacity: 0, y: 80 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         viewport={{ once: true }}
//       >
//         <h2>AI Interview Platform</h2>

//         <p>
//           Switch to Interview Mode. Upload resume. 
//           Let AI conduct technical, DSA and behavioral rounds dynamically.
//         </p>

//         <div className="ai-cards">

//           <motion.div
//             className="ai-card"
//             whileHover={{ scale: 1.05 }}
//           >
//             Resume Parsing
//           </motion.div>

//           <motion.div
//             className="ai-card"
//             whileHover={{ scale: 1.05 }}
//           >
//             Adaptive DSA Questions
//           </motion.div>

//           <motion.div
//             className="ai-card"
//             whileHover={{ scale: 1.05 }}
//           >
//             Behavioral Insights
//           </motion.div>

//         </div>
//       </motion.section>


//       {/* ================= CONTACT SECTION ================= */}
//       <motion.section
//         id="contact"
//         className="contact-section"
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         transition={{ duration: 1 }}
//         viewport={{ once: true }}
//       >
//         <h2>Ready to Experience MeetSphere?</h2>

//         <button
//           className="cta-button"
//           onClick={() => navigate("/signup")}
//         >
//           Start Now
//         </button>
//       </motion.section>

//       {/* ================= FOOTER ================= */}
// <footer className="footer">

//   <div className="footer-container">

//     {/* Brand Column */}
//     <div className="footer-col">
//       <h3>MeetSphere</h3>
//       <p>
//         AI powered video conferencing and intelligent interview
//         platform designed for modern teams.
//       </p>
//     </div>

//     {/* Product Links */}
//     <div className="footer-col">
//       <h4>Product</h4>
//       <ul>
//         <li>Video Meetings</li>
//         <li>AI Interview Mode</li>
//         <li>Attendance Tracking</li>
//         <li>Real-time Chat</li>
//       </ul>
//     </div>

//     {/* Company Links */}
//     <div className="footer-col">
//       <h4>Company</h4>
//       <ul>
//         <li>About Us</li>
//         <li>Careers</li>
//         <li>Blog</li>
//         <li>Contact</li>
//       </ul>
//     </div>

//     {/* Social */}
//     <div className="footer-col">
//       <h4>Connect</h4>
//       <ul>
//         <li>LinkedIn</li>
//         <li>Twitter</li>
//         <li>GitHub</li>
//         <li>Instagram</li>
//       </ul>
//     </div>

//   </div>

//   <div className="footer-bottom">
//     © {new Date().getFullYear()} MeetSphere. All rights reserved.
//   </div>

// </footer>

//     </div>
//   );
// }

// export default Home;



//--------------------------------------self version-------------------------------------------------------



import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import "./temphome.css";



function Home (){

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(()=>{
    if(user) {
      navigate("/dashboard");
    }
  }, [user])




  return(
    <div className="home-container">
      {/* //--------------------- nav section----------- */}
      <nav className="navbar">
        <div className="logo">
          MeetPro
        </div>
        <div className="nav-links">
          {!user ? (
            <>
          <Link to="/login" className="nav-btn">
          Login 
          </Link>
          <Link to="/signup" className="nav-btn signup-btn">
          Signup 
          </Link>
          </>
          ):(
            <Link to="/dashboard" className="nav-btn signup-btn">
            Go to Dashboard 
            </Link>
          )}
        </div>

      </nav>
    {/* // --------------------hero Section ---------------------------------------- */}
    <section className="hero">
      <h1>Meet with the power of AI interviewer</h1>
      <p>
        Secure, fast and reliable meetings with real-time chat,
          activity tracking and WebRTC powered video.
      </p>
      <div className="hero-buttons">
        <Link to="/signup" className="primary-btn">
        Get Started 
        </Link>
        <Link to="/login" className="secondary-btn">
        Already registered
        </Link>
      </div>
    </section>
    {/* // ---------------------features Section ------------------------ */}

    <section className="features">
      <div className="feature-card">
        <h3>Reliable and Secure</h3>
        <p>
          JWT based login system with email verification.
        </p>
      </div>
      <div className="feature-card">
        <h3>
            Real-time Meetings
        </h3>
        <p>
          WebRTC powered peer-to-peer video and chat system.
        </p>
      </div>
      <div className="feature-card">
        <h3>
            Ai based Interview
        </h3>
        <p>
          AI uses resume data to ask questions and counter questions.
        </p>
      </div>
       
    </section>

    {/* //----------------------------footer---------------------------- */}
    <footer className="footer">
    © {new Date().getFullYear()} MeetPro. All rights reserved.
    </footer>


    </div>
  );
}


export default Home;