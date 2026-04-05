import { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";

import "../styles/Admin.css";

const roleOptions = ["candidate", "interviewer", "admin"];

export default function Admin() {
  const { user } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [addingUser, setAddingUser] = useState(false);
  const [updatingRoleUserId, setUpdatingRoleUserId] = useState("");

  const [newUserForm, setNewUserForm] = useState({
    name: "",
    email: "",
    role: "candidate",
  });

  const [roleDrafts, setRoleDrafts] = useState({});

  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("/api/admin/users");
      const fetchedUsers = response.data?.users || [];

      setUsers(fetchedUsers);
      setRoleDrafts(
        fetchedUsers.reduce((acc, currentUser) => {
          acc[currentUser._id] = currentUser.role;
          return acc;
        }, {}),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchUsers();
    }
  }, [user?.role]);

  const handleNewUserChange = (e) => {
    setNewUserForm({
      ...newUserForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddingUser(true);
    setError("");
    setStatusMessage("");

    try {
      await API.post("/api/admin/users", {
        name: newUserForm.name.trim(),
        email: newUserForm.email.trim(),
        role: newUserForm.role,
      });

      setNewUserForm({ name: "", email: "", role: "candidate" });
      setStatusMessage("User added and credentials email sent successfully.");
      await fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add user");
    } finally {
      setAddingUser(false);
    }
  };

  const handleRoleDraftChange = (userId, nextRole) => {
    setRoleDrafts((prev) => ({
      ...prev,
      [userId]: nextRole,
    }));
  };

  const handleRoleUpdate = async (targetUser) => {
    const selectedRole = roleDrafts[targetUser._id] || targetUser.role;

    if (selectedRole === targetUser.role) {
      setStatusMessage("Role is already set for this user.");
      return;
    }

    setUpdatingRoleUserId(targetUser._id);
    setError("");
    setStatusMessage("");

    try {
      await API.patch(`/api/admin/users/${targetUser._id}/role`, {
        role: selectedRole,
      });

      setStatusMessage("User role updated and notification email sent successfully.");
      await fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update role");
    } finally {
      setUpdatingRoleUserId("");
    }
  };

  return (
    <>
      <Navbar />
      <div className="admin-page">
        <main className="admin-main">
          <div className="admin-section-header">
            <h1 className="admin-title">Admin Control Center</h1>
            <p className="admin-subtitle">
              Manage users, assign roles, and control platform access.
            </p>
          </div>

          {error && <div className="admin-alert admin-alert--error">{error}</div>}
          {statusMessage && <div className="admin-alert admin-alert--success">{statusMessage}</div>}

          <section className="admin-card admin-card--form">
            <h2 className="admin-card-title">Add New User</h2>
            <form className="admin-form" onSubmit={handleAddUser}>
              <input
                type="text"
                name="name"
                placeholder="Full name"
                value={newUserForm.name}
                onChange={handleNewUserChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={newUserForm.email}
                onChange={handleNewUserChange}
                required
              />
              <select
                name="role"
                value={newUserForm.role}
                onChange={handleNewUserChange}
                required
              >
                {roleOptions.map((role) => (
                  <option value={role} key={role}>
                    {role}
                  </option>
                ))}
              </select>

              <button type="submit" className="admin-btn" disabled={addingUser}>
                {addingUser ? "Adding user..." : "Add User"}
              </button>
            </form>
          </section>

          <section className="admin-card admin-card--list">
            <h2 className="admin-card-title">All Users</h2>

            {loading ? (
              <p className="admin-empty">Loading users...</p>
            ) : users.length === 0 ? (
              <p className="admin-empty">No users found.</p>
            ) : (
              <div className="admin-user-list">
                {users.map((listedUser) => (
                  <article className="admin-user-row" key={listedUser._id}>
                    <div className="admin-user-meta">
                      <h3>{listedUser.name}</h3>
                      <p>{listedUser.email}</p>
                    </div>

                    <div className="admin-role-actions">
                      <select
                        value={roleDrafts[listedUser._id] || listedUser.role}
                        onChange={(e) =>
                          handleRoleDraftChange(listedUser._id, e.target.value)
                        }
                      >
                        {roleOptions.map((role) => (
                          <option value={role} key={`${listedUser._id}-${role}`}>
                            {role}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        className="admin-btn admin-btn--secondary"
                        disabled={updatingRoleUserId === listedUser._id}
                        onClick={() => handleRoleUpdate(listedUser)}
                      >
                        {updatingRoleUserId === listedUser._id ? "Updating..." : "Update Role"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
}
