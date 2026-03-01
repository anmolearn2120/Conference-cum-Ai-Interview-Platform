import { useEffect, useState } from "react"
import API from "../api/axios";

import "./Dashboard.css";


export default function Activity() {


    const [activity , setactivity] = useState([]);
    const [error , seterror] = useState("");

        useEffect(()=>{
            fetchActivity();
        },[]);

        const fetchActivity = async () => {
            try {
                const res = await API.post("/api/activity/myactivity");
                setactivity(res.data);
            } catch (error) {

                seterror(error.respone?.data?.message || "Get Activity Failed");
                
            }

        }


  return (
     <div className="dashboard-container">
      <div className="activity-section">
        <h3>Your Recent Meetings</h3>

        {activity.length === 0 ? (
          <p>No meetings attended yet.</p>
        ) : (
          activity.slice(0, 5).map((item, index) => (
            <div key={index} className="activity-card">
              <p><b>Code:</b> {item.meetingCode}</p>
              <p><b>Joined:</b> {new Date(item.joinedAt).toLocaleString()}</p>
              <p><b>Duration:</b> {(item.duration / 1000).toFixed(0)} sec</p>
            </div>
          ))
        )}
      </div>
      </div>
  );
}
