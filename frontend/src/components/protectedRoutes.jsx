// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     return <Navigate to="/login" />;
//   }

//   return children;
// };

// export default ProtectedRoute;
// bhai ise samjo 
//isme kya hota hai ke jb hum kuch cheez 
//protected route me wrap krte hai tho co cheez uski children ban jati hai
// ProtectedRoute({
//    children: <Dashboard />
// })


// tho yha pr jo children hai vo DashBoard componnt hai 



import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children }) {

  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // prevent flicker

  if (!user) {
    return <Navigate to="/" />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin" />;
  }

  return children;
}

export default ProtectedRoute;