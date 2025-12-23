import { useEffect, useState } from "react";
import { monthlyAttendanceReport } from "../../services/api";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/* 🔑 DATE NORMALIZATION ONLY */
const normalizeAttendanceDates = (attendanceObj = {}) => {
  const normalized = {};

  Object.keys(attendanceObj).forEach((key) => {
    const [month, day, year] = key.split("/");
    const newKey = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    normalized[newKey] = attendanceObj[key];
  });

  return normalized;
};

export default function MonthlyAttendanceAdmin() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState([]);

  const fetchReport = async () => {
    try {
      const res = await monthlyAttendanceReport(month, year);

      // 🔥 ONLY CHANGE IS HERE
      const formatted = (res.data || []).map((user) => ({
        ...user,
        attendance: normalizeAttendanceDates(user.attendance || {}),
      }));

      setData(formatted);
    } catch (err) {
      toast.error(err.message || "Failed to load monthly report");
    }
  };

  const downloadExcel = () => {
  if (data.length === 0) {
    toast.warning("No data to download");
    return;
  }

  // 🔹 Header row (FIXED ORDER)
  const header = ["Name", "Department"];
  for (let d = 1; d <= daysInMonth; d++) {
    header.push(d.toString());
  }

  // 🔹 Data rows
  const rows = data.map((user) => {
    const row = [user.name, user.department];

    for (let d = 1; d <= daysInMonth; d++) {
      const day = String(d).padStart(2, "0");
      const monthStr = String(month).padStart(2, "0");
      const dateKey = `${year}-${monthStr}-${day}`;

      row.push(user.attendance?.[dateKey] || "");
    }

    return row;
  });

  // 🔹 Create worksheet using AOA (array of arrays)
  const worksheet = XLSX.utils.aoa_to_sheet([header, ...rows]);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array"
  });

  const blob = new Blob([excelBuffer], {
    type: "application/octet-stream"
  });

  saveAs(blob, `Attendance_${month}_${year}.xlsx`);
};

  useEffect(() => {
    fetchReport();
  }, [month, year]);

  // 📅 Days in selected month
  const daysInMonth = new Date(year, month, 0).getDate();

  return (
    <>
      <Navbar />
      <Sidebar />

      <div className="main-content mt-4">
        <h4>Monthly Attendance Sheet (Admin)</h4>

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
            <div className="d-flex gap-2">
              <button
                className="btn login-left text-white"
                onClick={fetchReport}
              >
                Fetch Report
              </button>

              <button className="btn btn-success" onClick={downloadExcel}>
                Download Excel
              </button>
            </div>
          </div>
        </div>

        {/* Attendance Sheet */}
        <div className="card shadow-sm table-responsive">
          <table className="table table-bordered text-center align-middle">
            <thead className="table-light">
              <tr>
                <th>User</th>
                <th>Department</th>
                {[...Array(daysInMonth)].map((_, i) => (
                  <th key={i}>{i + 1}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={daysInMonth + 2} className="text-center">
                    No data found
                  </td>
                </tr>
              ) : (
                data.map((user) => (
                  <tr key={user.userId}>
                    <td className="text-start fw-semibold">{user.name}</td>
                    <td>{user.department}</td>

                    {[...Array(daysInMonth)].map((_, i) => {
                      const day = String(i + 1).padStart(2, "0");
                      const monthStr = String(month).padStart(2, "0");
                      const dateKey = `${year}-${monthStr}-${day}`;

                      const status = user.attendance[dateKey];

                      const badgeClass =
                        status === "P"
                          ? "bg-success"
                          : status === "A"
                          ? "bg-danger"
                          : status === "L"
                          ? "bg-warning text-dark"
                          : status === "S"
                          ? "bg-info"
                          : "bg-light text-muted";

                      return (
                        <td key={i}>
                          {status ? (
                            <span className={`badge ${badgeClass}`}>
                              {status}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
