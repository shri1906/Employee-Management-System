import { useEffect, useState } from "react";
import { myMonthlyAttendance } from "../../services/api";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { toast } from "react-toastify";
import { sanitizeInput } from "../../utils/sanitize";

export default function MonthlyAttendanceUser() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [attendance, setAttendance] = useState({});

  // 🔐 Normalize backend attendance keys
  const normalizeAttendanceDates = (attendanceObj = {}) => {
    const normalized = {};

    Object.keys(attendanceObj).forEach((key) => {
      const cleanKey = sanitizeInput(key);

      const [m, d, y] = cleanKey.split("/");
      if (!m || !d || !y) return;

      const newKey = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
      normalized[newKey] = sanitizeInput(attendanceObj[key]);
    });

    return normalized;
  };

  useEffect(() => {
    const fetchReport = async () => {
      const safeMonth = Number(sanitizeInput(String(month)));
      const safeYear = Number(sanitizeInput(String(year)));

      if (safeMonth < 1 || safeMonth > 12) {
        return toast.error("Invalid month");
      }

      if (safeYear < 2000 || safeYear > 2100) {
        return toast.error("Invalid year");
      }

      try {
        const res = await myMonthlyAttendance(safeMonth, safeYear);
        setAttendance(normalizeAttendanceDates(res?.attendance ?? {}));
      } catch (err) {
        toast.error(err.message || "Failed to fetch attendance");
      }
    };
    fetchReport();
  }, [month, year]);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();

  return (
    <>
      <Navbar />
      <Sidebar />

      <div className="main-content mt-4">
        <h4>My Monthly Attendance</h4>

        {/* Filters */}
        <div className="row g-3 mb-3">
          <div className="col-md-3">
            <label className="form-label">Month</label>
            <input
              type="number"
              min="1"
              max="12"
              className="form-control"
              value={month}
              onChange={(e) => setMonth(Number(sanitizeInput(e.target.value)))}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Year</label>
            <input
              type="number"
              className="form-control"
              value={year}
              onChange={(e) => setYear(Number(sanitizeInput(e.target.value)))}
            />
          </div>
        </div>

        {/* Calendar */}
        <div className="mb-4">
          <div className="card-body table-responsive">
            <table className="table table-bordered text-center">
              <thead className="table-light">
                <tr>
                  <th>Sun</th>
                  <th>Mon</th>
                  <th>Tue</th>
                  <th>Wed</th>
                  <th>Thu</th>
                  <th>Fri</th>
                  <th>Sat</th>
                </tr>
              </thead>

              <tbody>
                {[...Array(Math.ceil((daysInMonth + firstDay) / 7))].map(
                  (_, weekIndex) => (
                    <tr key={weekIndex}>
                      {[...Array(7)].map((_, dayIndex) => {
                        const dayNumber =
                          weekIndex * 7 + dayIndex - firstDay + 1;

                        if (dayNumber < 1 || dayNumber > daysInMonth) {
                          return <td key={dayIndex}></td>;
                        }

                        const dateKey = `${year}-${String(month).padStart(
                          2,
                          "0"
                        )}-${String(dayNumber).padStart(2, "0")}`;

                        const status = attendance[dateKey];

                        const badgeClass =
                          status === "P"
                            ? "bg-success"
                            : status === "A"
                            ? "bg-danger"
                            : status === "L"
                            ? "bg-warning text-dark"
                            : status === "S"
                            ? "bg-info"
                            : "";

                        return (
                          <td key={dayIndex} className={badgeClass}>
                            <div>{dayNumber}</div>
                            {status && <span className="badge">{status}</span>}
                          </td>
                        );
                      })}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="mb-3">
            <span className="badge bg-success me-2">P</span> Present
            <span className="badge bg-danger ms-3 me-2">A</span> Absent
            <span className="badge bg-warning text-dark ms-3 me-2">L</span>{" "}
            Leave
            <span className="badge bg-info ms-3 me-2">S</span> Sick
          </div>
        </div>
      </div>
    </>
  );
}
