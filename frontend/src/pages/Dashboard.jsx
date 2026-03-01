import { useContext, useState } from "react"
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";

import "./Dashboard.css";





export default function Dashboard() {

  const navigate = useNavigate();
  const { user , logout } = useContext(AuthContext);


  const[error , seterror] = useState("");
  const [loading , setloading] = useState(false);
  const [meetingCode , setmeetingCode] = useState("");
  const [joincode, setjoincode] = useState("");
  const [showModal , setshowModal] = useState(false);

  const handlecreateMeeting = async() => {
    try {

      const response = await API.post("/api/meetings/create");
      setmeetingCode(response.data.meetingCode);
      setshowModal(true);
      
    } catch (err) {

      seterror(err.response?.data?.message || "Failed to create Meeting")
      
    }
    setloading(false);

  }


  const handlejoinMeeting = async() => {

    if(!joincode)
       return;



    try {
      const res = await API.get(`/api/meetings/verify/${joincode}`);

      navigate(`/meeting/${joincode}`);
    } catch (error) {
      seterror(error.response?.data?.message || "Join meeting Failed");
    }
  }

  const handlecopy = ()=>{
    navigator.clipboard.writeText(meetingCode);
    alert("Meeting code copied to clipboard");
  };

  const handleshare =() => {
    const link = `${windows.location.origin}/meeting/${meetingCode}`;
    navigator.clipboard.writeText(link);
    alert("Meeting Link copied");
  };






  return (
    <div className="dashboard-container">
      <div className="dashboard-navbar">
        <h2>MeetPro</h2>
        <div className="nav-right">
          <span > Welcome, {user?.name} </span>
          <button onClick={()=> navigate("/activity")}>MY Activity</button>
          <button onClick={logout}> Logout </button>

        </div>

      </div>

      {error && <p className="error-text">{error}</p>}

      {/* Main Section */}

      <div className="dashboard-cards">
        <div className="card">
          <h3> Create new Meeting</h3>
          <button onClick={handlecreateMeeting} disabled={loading}>
            {loading ? "Creating...." : "Create Meeting"}
          </button>
        </div>


        <div className="card">
          <h3>Join Meeting</h3>
          <input 
           type="text"
           name="joincode"
           placeholder="meeting Code"
           value={joincode}
           onChange={(e)=> setjoincode(e.target.value)}
           />
           <button onClick={handlejoinMeeting}>
            Join Meeting
           </button>
        </div>


        {showModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h3>Meeting Created</h3>
              <p className="meeting-code">{meetingCode}</p>
              <div className="modal-buttons">
                <button onClick={handlecopy}>Copy</button>
                <button onClick={handleshare}>Share </button>
                </div>

                <button 
                  className="join-btn"
                  onClick={()=> navigate(`/meeting/${meetingCode}`)}>
                    Join the Meeting
                  </button>

                  <p 
                    className="close-text"
                    onClick={()=> setshowModal(false)}
                    >
                      Close
                    </p>

              </div>
          </div>
        )}








      </div>

    </div>
  )
}
