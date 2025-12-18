import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { myAttendance } from "../../services/api";
import { FaClipboardList } from "react-icons/fa";
import { Link } from "react-router-dom";

const MyAttendance = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const getMyAttendance = async () => {
      const res = await myAttendance();
      setData(res.attendance);
    };
    getMyAttendance();
  }, []);
  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="main-content">
        <h4>My Attendance</h4>
        <div className="row mb-4 justify-content-end">
          <div className="col-md-2 d-flex justify-content-end">
            <Link
              to="/user/monthly-attendance-report"
              className="btn login-left text-white d-flex align-items-center gap-2"
            >
              <FaClipboardList />
              <span>Monthly Report</span>
            </Link>
          </div>
        </div>
        <div className="card-body table-responsive">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Date</th>
                <th>Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((a) => (
                <tr key={a._id}>
                  <td>{new Date(a.date).toLocaleDateString()}</td>
                  <td>{a.departmentId?.name}</td>
                  <td>
                    <span
                      className={`badge ${
                        a.status === "Present"
                          ? "bg-success"
                          : a.status === "Absent"
                          ? "bg-danger"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default MyAttendance;
