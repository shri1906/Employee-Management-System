import { useAuth } from "../context/AuthContext";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import "./sidebar.css";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="app-navbar">
      <span className="navbar-brand fw-bold">Employee Management System</span>

      {user && (
        <div className="d-flex align-items-center gap-3">
          <span className="user-name d-none d-md-inline">
            <FaUserCircle className="me-1" />
            {user.name}
          </span>

          <button
            className="btn btn-sm btn-outline-light"
            onClick={logout}
          >
            <FaSignOutAlt className="me-1" />
            <span className="d-none d-md-inline">Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
