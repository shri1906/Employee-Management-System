import { useEffect, useState } from "react";
import { myMonthlyAttendance } from "../../services/api";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { toast } from "react-toastify";

export default function MonthlyAttendanceUser() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [attendance, setAttendance] = useState({});

  const normalizeAttendanceDates = (attendanceObj = {}) => {
    const normalized = {};

    Object.keys(attendanceObj).forEach((key) => {
      // key = "12/18/2025"
      const [month, day, year] = key.split("/");

      const newKey = `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}`;

      normalized[newKey] = attendanceObj[key];
    });

    return normalized;
  };

  const fetchReport = async () => {
    try {
      const res = await myMonthlyAttendance(month, year);
      setAttendance(normalizeAttendanceDates(res?.attendance ?? {}));
    } catch (err) {
      toast.error(err.message || "Failed to fetch attendance");
    }
  };

  useEffect(() => {
    fetchReport();
  }, [month, year]);
  console.log(attendance);

  // 📅 Calendar helpers
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay(); // 0 = Sunday

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
              onChange={(e) => setMonth(Number(e.target.value))}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Year</label>
            <input
              type="number"
              className="form-control"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            />
          </div>
          <div className="col-md-3 align-self-end">
            <button className="btn login-left text-white" onClick={fetchReport}>
              Fetch Report
            </button>
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
                          <td key={dayIndex} className={`${badgeClass}`}>
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
