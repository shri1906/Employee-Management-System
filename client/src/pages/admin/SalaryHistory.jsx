import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import {
  getAllSalaries,
  downloadSalarySlip,
  emailSalarySlip,
} from "../../services/api";
import { toast } from "react-toastify";

const SalaryHistory = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const fetchSalaries = async () => {
    try {
      setLoading(true);
      const res = await getAllSalaries();
      setSalaries(res);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  // 🔹 PAGINATION CALCULATION
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const paginatedSalaries = salaries.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(salaries.length / recordsPerPage);

  const downloadSlip = async (id) => {
    try {
      const res = await downloadSalarySlip(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "SalarySlip.pdf";
      a.click();
    } catch {
      toast.error("Download failed");
    }
  };

  const sendEmail = async (id) => {
    try {
      await emailSalarySlip(id);
      toast.success("Salary slip emailed");
    } catch {
      toast.error("Email failed");
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar />

      <div className="main-content">
        <h4 className="mb-4">Salary Management</h4>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Month</th>
                    <th>Year</th>
                    <th>Net Salary</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSalaries.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No salary records found
                      </td>
                    </tr>
                  ) : (
                    paginatedSalaries.map((s) => (
                      <tr key={s._id}>
                        <td>{s.userId?.name}</td>
                        <td>{s.departmentId?.name}</td>
                        <td>{s.month}</td>
                        <td>{s.year}</td>
                        <td>₹ {s.netSalary}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary me-2"
                            onClick={() => downloadSlip(s._id)}
                          >
                            Download
                          </button>

                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => sendEmail(s._id)}
                          >
                            Email
                          </button>
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
          </>
        )}
      </div>
    </>
  );
};

export default SalaryHistory;
