import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AIDashboard from "./pages/AIDashboard.jsx";
import MeetingRoom from "./pages/MeetingRoom";
import Activity from "./pages/Activity";
import Pricing from "./pages/Pricing";
import ProtectedRoute from "./components/protectedRoutes";
import AdminRoute from "./components/AdminRoute";
import Background from "./components/Background";
import Navbar from "./components/Navbar";
import AIActivity from "./pages/AIActivity";
import ResumeUpload from "./pages/ResumeUpload.jsx";
import AiMeetingRoom from "./pages/AiMeetingRoom.jsx"
import Admin from "./pages/Admin.jsx";

function App() {
  return (
    <div className="app-shell">
      {/* <Background /> */}
      <div className="app-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pricing" element={<Pricing />} />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/activity"
            element={
              <ProtectedRoute>
                <Activity />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ai/dashboard"
            element={
              <ProtectedRoute>
                <AIDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai/upload-resume/:aiCode"
            element={
              <ProtectedRoute>
                <ResumeUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai/activity"
            element={
              <ProtectedRoute>
                <AIActivity />
              </ProtectedRoute>
            }
          />

          <Route
            path="/meeting/:code"
            element={
              <ProtectedRoute>
                <MeetingRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai/room/:aiCode"
            element={
              <ProtectedRoute>
                <AiMeetingRoom />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;