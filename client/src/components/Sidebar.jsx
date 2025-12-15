import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <div className="bg-light border-end vh-100 p-3" style={{ width: 220 }}>
      <h6 className="mb-3">Menu</h6>

      {user?.role === "admin" && (
        <>
          <Link className="d-block mb-2" to="/admin">Dashboard</Link>
          <Link className="d-block mb-2" to="/admin/departments">Departments</Link>
          <Link className="d-block mb-2" to="/admin/users">Users</Link>
          <Link className="d-block mb-2" to="/admin/salary">Salary</Link>
          <Link className="d-block mb-2" to="/admin/attendance">Attendance</Link>
        </>
      )}

      {user?.role === "user" && (
        <>
          <Link className="d-block mb-2" to="/user">Dashboard</Link>
          <Link className="d-block mb-2" to="/user/profile">Profile</Link>
          <Link className="d-block mb-2" to="/user/salary">Salary</Link>
          <Link className="d-block mb-2" to="/user/attendance">Attendance</Link>
        </>
      )}
    </div>
  );
};

export default Sidebar;
