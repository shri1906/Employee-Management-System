import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { getTodayAttendance, markAttendance } from "../../services/api";

const statuses = ["Present", "Absent", "Leave", "Sick"];

const Attendance = () => {
  const [list, setList] = useState([]);
  useEffect(() => {
    const fetchToday = async () => {
      try {
        const res = await getTodayAttendance();
        setList(res.attendance);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchToday();
  }, []);

  const handleChange = async (userId, departmentId, status) => {
    try {
      await markAttendance({ userId, departmentId, status });

      // re-fetch attendance safely
      const res = await getTodayAttendance();
      setList(res.attendance);
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
        <div className="row mt-4">
          <div className="card-body table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>User</th>
                  <th>Department</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {list.map((row) => (
                  <tr key={row._id}>
                    <td>{row.userId?.name}</td>
                    <td>{row.departmentId?.name}</td>
                    <td>
                      <select
                        className="form-select"
                        value={row.status}
                        onChange={(e) =>
                          handleChange(
                            row.userId._id,
                            row.departmentId._id,
                            e.target.value
                          )
                        }
                      >
                        {statuses.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
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

export default Attendance;
