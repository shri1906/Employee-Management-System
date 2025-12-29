import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { getTodayAttendance, markAttendance } from "../../services/api";
import { FaClipboardList } from "react-icons/fa";
import { Link } from "react-router-dom";
import { sanitizeInput } from "../../utils/sanitize";

const statuses = ["Present", "Absent", "Leave", "Sick"];

const Attendance = () => {
  const [list, setList] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    fetchToday();
  }, []);

  const fetchToday = async () => {
    try {
      const res = await getTodayAttendance();
      const attendance = res.attendance || [];

      setList(attendance);

      const initial = {};
      attendance.forEach((row) => {
        if (!row.marked) {
          initial[sanitizeInput(row.userId)] =
            sanitizeInput(row.status) || "Absent";
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
      [sanitizeInput(userId)]: sanitizeInput(status),
    }));
  };

  const handleMark = async (userId, departmentId) => {
    const sanitizedUserId = sanitizeInput(userId);
    const sanitizedDeptId = sanitizeInput(departmentId);
    const status = sanitizeInput(selectedStatus[sanitizedUserId]);

    if (!status) return;

    try {
      setLoadingId(sanitizedUserId);

      await markAttendance({
        userId: sanitizedUserId,
        departmentId: sanitizedDeptId,
        status,
      });

      await fetchToday();
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar />

      <div className="main-content">
        <h4>Attendance Management</h4>

        <div className="row mb-4 justify-content-end">
          <div className="col-md-2">
            <Link
              to="/admin/monthly-attendance-report"
              className="btn login-left text-white d-flex align-items-center gap-2"
            >
              <FaClipboardList />
              Monthly Report
            </Link>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>User</th>
                <th>Department</th>
                <th>Status</th>
                <th width="120">Action</th>
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
                  const userId = sanitizeInput(row.userId);
                  const isMarked = row.marked === true;

                  const currentStatus = isMarked
                    ? sanitizeInput(row.status)
                    : selectedStatus[userId];

                  return (
                    <tr
                      key={userId}
                      className={isMarked ? "table-success" : ""}
                    >
                      <td>{sanitizeInput(row.name)}</td>
                      <td>{sanitizeInput(row.departmentName) || "-"}</td>

                      {/* STATUS */}
                      <td>
                        <div className="d-flex flex-wrap gap-3">
                          {statuses.map((s) => (
                            <div
                              key={s}
                              className="form-check form-check-inline"
                            >
                              <input
                                type="radio"
                                name={`status-${userId}`}
                                className="form-check-input"
                                checked={currentStatus === s}
                                disabled={isMarked}
                                onChange={() =>
                                  handleCheckboxChange(userId, s)
                                }
                              />
                              <label className="form-check-label">
                                {s}
                              </label>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary w-100"
                          disabled={isMarked || loadingId === userId}
                          onClick={() =>
                            handleMark(userId, row.departmentId)
                          }
                        >
                          {isMarked
                            ? "Marked"
                            : loadingId === userId
                            ? "Saving..."
                            : "Mark"}
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
    </>
  );
};

export default Attendance;
