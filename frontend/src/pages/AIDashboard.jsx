import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import DottedSurface from "../components/DottedSurface";
import RobotSpline from "../components/RobotSpline";
import StarButton from "../components/StarButton";
import CreateAIInterviewModal from "../components/CreateAIInterviewModal";
import JoinAIInterviewModal from "../components/JoinAIInterviewModal";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";

import "../styles/AIDashboard.css";

export default function AIDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [showFreeAccessForm, setShowFreeAccessForm] = useState(false);
  const [showFreeAccessCard, setShowFreeAccessCard] = useState(Boolean(user?.isNewUser));
  const [freeAccessName, setFreeAccessName] = useState(user?.name || "");
  const [freeAccessEmail, setFreeAccessEmail] = useState(user?.email || "");
  const [freeAccessPurpose, setFreeAccessPurpose] = useState("");
  const [isSubmittingFreeAccess, setIsSubmittingFreeAccess] = useState(false);

  const canCreateInterview = user?.role === "interviewer" || user?.role === "admin";

  const handleCreateButtonClick = () => {
    if (canCreateInterview) {
      setShowCreate(true);
      return;
    }

    navigate("/pricing");
  };

  const handleFreeAccessSubmit = async (e) => {
    e.preventDefault();

    const name = freeAccessName.trim();
    const email = freeAccessEmail.trim();
    const purpose = freeAccessPurpose.trim();

    if (!name || !email || !purpose) {
      alert("Please fill name, email and purpose");
      return;
    }

    setIsSubmittingFreeAccess(true);

    try {
      await API.post("/request-free-access", { name, email, purpose });

      setShowFreeAccessForm(false);
      setShowFreeAccessCard(false);
      setFreeAccessPurpose("");

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        parsedUser.isNewUser = false;
        localStorage.setItem("user", JSON.stringify(parsedUser));
      }

      alert("Thanks for showing interest. You will get your code within 24 hrs");
    } catch (err) {
      alert(err.response?.data?.message || "Request free access failed");
    } finally {
      setIsSubmittingFreeAccess(false);
    }
  };

  return (
    <>
      <DottedSurface />
      <Navbar />
      <div className="ai-dashboard-main">
        <div className="ai-dashboard-left">
          <RobotSpline />
        </div>
        <div className="ai-dashboard-right">
          <div className="ai-section-header">
            <h1 className="ai-greeting">AI Interview Studio</h1>
            <p className="ai-greeting-sub">Create or join an AI-powered interview session.</p>
          </div>
          <div className="ai-cards">

            {showFreeAccessCard && (
              <button
                type="button"
                className="ai-card ai-card--free-access"
                onClick={() => setShowFreeAccessForm(true)}
              >
                <div className="ai-card-icon">🎁</div>
                <h3 className="ai-card-title">Request your 1 free Interview</h3>
                <p className="ai-card-desc">Share your purpose and we will send your code within 24 hrs.</p>
              </button>
            )}

            {/* Create Card */}
            <div className="ai-card ai-card--create">
              <div className="ai-card-icon">🤖</div>
              <h3 className="ai-card-title">New AI Interview</h3>
              <p className="ai-card-desc">Start an AI-led interview session and get instant candidate evaluation.</p>
              <StarButton variant="primary" onClick={handleCreateButtonClick}>
                {canCreateInterview ? "Create AI Interview" : "Buy Subscription"}
              </StarButton>
            </div>

            {/* Join Card */}
            <div className="ai-card ai-card--join">
              <div className="ai-card-icon">🔗</div>
              <h3 className="ai-card-title">Join AI Interview</h3>
              <p className="ai-card-desc">Enter a session code to join an ongoing AI interview.</p>
              <StarButton variant="join" onClick={() => setShowJoin(true)}>
                Join AI Interview
              </StarButton>
            </div>

          </div>
        </div>
      </div>

      {showFreeAccessForm && (
        <div className="ai-free-access-overlay" onClick={() => setShowFreeAccessForm(false)}>
          <div className="ai-free-access-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="ai-free-access-title">Request your 1 free Interview</h2>
            <form className="ai-free-access-form" onSubmit={handleFreeAccessSubmit}>
              <input
                type="text"
                placeholder="Name"
                value={freeAccessName}
                onChange={(e) => setFreeAccessName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                value={freeAccessEmail}
                onChange={(e) => setFreeAccessEmail(e.target.value)}
              />
              <textarea
                placeholder="testing, practise interview, exploring platform"
                value={freeAccessPurpose}
                onChange={(e) => setFreeAccessPurpose(e.target.value)}
              />

              <div className="ai-free-access-actions">
                <button type="submit" className="ai-free-access-submit" disabled={isSubmittingFreeAccess}>
                  {isSubmittingFreeAccess ? "Submitting..." : "Submit"}
                </button>
                <button
                  type="button"
                  className="ai-free-access-cancel"
                  onClick={() => setShowFreeAccessForm(false)}
                  disabled={isSubmittingFreeAccess}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCreate && <CreateAIInterviewModal close={() => setShowCreate(false)} />}
      {showJoin && <JoinAIInterviewModal close={() => setShowJoin(false)} />}
    </>
  );
}
