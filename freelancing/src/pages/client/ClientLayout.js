import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/dashboard.css";

export default function ClientLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="dashboard-layout">

      <aside className="sidebar">

        <h2>Client Portal</h2>

        <button
          className={location.pathname === "/client/dashboard" ? "nav-item active" : "nav-item"}
          onClick={() => navigate("/client/dashboard")}
        >
          Dashboard Home
        </button>

        <button
          className={location.pathname === "/client/profile" ? "nav-item active" : "nav-item"}
          onClick={() => navigate("/client/profile")}
        >
          Profile
        </button>

        <button
          className={location.pathname === "/client/post-project" ? "nav-item active" : "nav-item"}
          onClick={() => navigate("/client/post-project")}
        >
          Post a Project
        </button>

        <button
          className={location.pathname === "/client/messages" ? "nav-item active" : "nav-item"}
          onClick={() => navigate("/client/messages")}
        >
          Messaging
        </button>

        <button
          className="nav-item logout"
          onClick={() => {
            logout();
            navigate("/client/login");
          }}
        >
          Logout
        </button>

      </aside>

      <main className="dashboard-content">
        <Outlet />
      </main>

    </div>
  );
}