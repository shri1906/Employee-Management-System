import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { getTodayAttendance, markAttendance } from "../../services/api";
import { FaClipboardList } from "react-icons/fa";
import { Link } from "react-router-dom";

const statuses = ["Present", "Absent", "Leave", "Sick"];

const Attendance = () => {
  const [list, setList] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({}); // userId -> status

  useEffect(() => {
    fetchToday();
  }, []);
  const fetchToday = async () => {
    try {
      const res = await getTodayAttendance();
      setList(res.attendance);

      // Initialize selectedStatus for already marked users
      const initial = {};
      res.attendance.forEach((row) => {
        if (row.status) {
          initial[row.userId] = row.status;
        }
      });
      setSelectedStatus(initial);
    } catch (err) {
      console.error(err.message);
    }
  };
  const handleCheckboxChange = (userId, status) => {
    setSelectedStatus((prev) => ({
      ...prev,
      [userId]: status,
    }));
  };

  const handleMark = async (userId, departmentId) => {
    try {
      const status = selectedStatus[userId];
      if (!status) return;

      await markAttendance({ userId, departmentId, status });
      await fetchToday(); // refresh to lock row
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar />

      <div className="main-content">
        <h4>Attendance Management</h4>

        <div className="row mb-4 justify-content-end">
          <div className="col-md-2 d-flex justify-content-end">
            <Link
              to="/admin/monthly-attendance-report"
              className="btn login-left text-white d-flex align-items-center gap-2"
            >
              <FaClipboardList />
              <span>Monthly Report</span>
            </Link>
          </div>
        </div>

        <div className="row mt-4">
          <div className="card-body table-responsive">
            <table className="table table-bordered table-striped align-middle">
              <thead className="table-dark">
                <tr>
                  <th>User</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {list.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No users found
                    </td>
                  </tr>
                ) : (
                  list.map((row) => {
                    const isMarked = Boolean(row.status);

                    return (
                      <tr key={row.userId}>
                        <td>{row.name}</td>
                        <td>{row.departmentName}</td>

                        {/* STATUS CHECKBOXES */}
                        <td>
                          <div className="d-flex gap-3">
                            {statuses.map((s) => (
                              <div
                                key={s}
                                className="form-check form-check-inline"
                              >
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={selectedStatus[row.userId] === s}
                                  disabled={isMarked}
                                  onChange={() =>
                                    handleCheckboxChange(row.userId, s)
                                  }
                                />
                                <label className="form-check-label">
                                  {s}
                                </label>
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* MARK BUTTON */}
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            disabled={
                              isMarked || !selectedStatus[row.userId]
                            }
                            onClick={() =>
                              handleMark(row.userId, row.departmentId)
                            }
                          >
                            Mark
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Attendance;
