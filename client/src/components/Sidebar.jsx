import { Link } from "react-router-dom";
import "./sidebar.css"
import { useAuth } from "../context/AuthContext";
import {
  FaTachometerAlt,
  FaUsers,
  FaBuilding,
  FaMoneyBill,
  FaCalendarCheck,
  FaUser,
  FaTools
} from "react-icons/fa";


const Sidebar = () => {
  const { user } = useAuth();

  return (
    <div className="sidebar">
      {user?.role === "admin" && (
        <>
          <Link to="/admin" className="sidebar-item">
            <FaTachometerAlt />
            <span>Dashboard</span>
          </Link>

          <Link to="/admin/departments" className="sidebar-item">
            <FaBuilding />
            <span>Departments</span>
          </Link>

          <Link to="/admin/users" className="sidebar-item">
            <FaUsers />
            <span>Users</span>
          </Link>

          <Link to="/admin/salary" className="sidebar-item">
            <FaMoneyBill />
            <span>Salary</span>
          </Link>

          <Link to="/admin/attendance" className="sidebar-item">
            <FaCalendarCheck />
            <span>Attendance</span>
          </Link>
          <Link to="/admin/settings" className="sidebar-item">
            <FaTools />
            <span>Settings</span>
          </Link>
        </>
      )}

      {user?.role === "user" && (
        <>
          <Link to="/user" className="sidebar-item">
            <FaTachometerAlt />
            <span>Dashboard</span>
          </Link>

          <Link to="/user/profile" className="sidebar-item">
            <FaUser />
            <span>Profile</span>
          </Link>

          <Link to="/user/salary" className="sidebar-item">
            <FaMoneyBill />
            <span>Salary</span>
          </Link>

          <Link to="/user/attendance" className="sidebar-item">
            <FaCalendarCheck />
            <span>Attendance</span>
          </Link>
           <Link to="/admin/settings" className="sidebar-item">
            <FaTools />
            <span>Settings</span>
          </Link>
        </>
      )}
    </div>
  );
};

export default Sidebar;
