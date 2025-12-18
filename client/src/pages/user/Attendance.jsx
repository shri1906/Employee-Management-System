import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { myAttendance } from "../../services/api";

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
        <div className="card shadow-sm">
          <div className="card-header bg-secondary text-white">
            My Attendance
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
      </div>
    </>
  );
};

export default MyAttendance;
