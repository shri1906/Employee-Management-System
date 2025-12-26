import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { myAttendance } from "../../services/api";
import { FaClipboardList } from "react-icons/fa";
import { Link } from "react-router-dom";

const MyAttendance = () => {
  const [data, setData] = useState([]);

  // 🔹 PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    const getMyAttendance = async () => {
      const res = await myAttendance();
      setData(res.attendance || []);
    };
    getMyAttendance();
  }, []);

  // 🔹 PAGINATION LOGIC
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const paginatedData = data.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(data.length / recordsPerPage);

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
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>Date</th>
                <th>Department</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center">
                    No attendance records found
                  </td>
                </tr>
              ) : (
                paginatedData.map((a) => (
                  <tr key={a._id}>
                    <td>{new Date(a.date).toLocaleDateString()}</td>
                    <td>{a.departmentId?.name || "-"}</td>
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 🔹 PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <nav className="d-flex justify-content-center mt-3">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 && "disabled"}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Previous
                </button>
              </li>

              {[...Array(totalPages)].map((_, i) => (
                <li
                  key={i}
                  className={`page-item ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}

              <li
                className={`page-item ${
                  currentPage === totalPages && "disabled"
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </>
  );
};

export default MyAttendance;
