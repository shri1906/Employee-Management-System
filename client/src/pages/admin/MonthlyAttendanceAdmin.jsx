import { useEffect, useState } from "react";
import { monthlyAttendanceReport } from "../../services/api";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { toast } from "react-toastify";
import ExcelJS from "exceljs";

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

  const daysInMonth = new Date(year, month, 0).getDate();

 
  useEffect(() => {
     const fetchReport = async () => {
    try {
      const res = await monthlyAttendanceReport(month, year);

      const formatted = (res.data || []).map((user) => ({
        ...user,
        attendance: normalizeAttendanceDates(user.attendance || {}),
      }));

      setData(formatted);
    } catch (err) {
      toast.error(err.message || "Failed to load monthly report");
    }
  };

    fetchReport();
  }, [month, year]);

  const downloadExcel = async () => {
    if (data.length === 0) {
      toast.warning("No data to download");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Attendance");

    const header = ["Name", "Department"];
    for (let d = 1; d <= daysInMonth; d++) {
      header.push(d.toString());
    }

    sheet.addRow(header);

    sheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    data.forEach((user) => {
      const row = [user.name, user.department];

      for (let d = 1; d <= daysInMonth; d++) {
        const day = String(d).padStart(2, "0");
        const monthStr = String(month).padStart(2, "0");
        const dateKey = `${year}-${monthStr}-${day}`;

        row.push(user.attendance?.[dateKey] || "");
      }

      sheet.addRow(row);
    });

    sheet.columns = [
      { width: 25 },
      { width: 20 },
      ...Array(daysInMonth).fill({ width: 5 }),
    ];

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Attendance_${month}_${year}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

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

          <div className="col-md-4 align-self-end">
            <div className="d-flex gap-2">
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
