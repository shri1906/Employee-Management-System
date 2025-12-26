import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import {
  getAllSalaries,
  downloadSalarySlip,
  emailSalarySlip,
} from "../../services/api";
import { toast } from "react-toastify";
import { FaRegListAlt, FaFileDownload } from "react-icons/fa";
import { MdMarkEmailRead } from "react-icons/md";

const capitalizeFirst = (text) => text.charAt(0).toUpperCase() + text.slice(1);

const SalaryHistory = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState(null);

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

  // Pagination logic
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

  const openModal = (salary) => {
    setSelectedSalary(salary);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSalary(null);
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
                        <td className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-info"
                            data-bs-toggle="tooltip"
                            title="View Details"
                            onClick={() => openModal(s)}
                          >
                            <FaRegListAlt />
                          </button>

                          <button
                            className="btn btn-sm btn-primary"
                            data-bs-toggle="tooltip"
                            title="Download"
                            onClick={() => downloadSlip(s._id)}
                          >
                            <FaFileDownload />
                          </button>

                          <button
                            className="btn btn-sm btn-success"
                            data-bs-toggle="tooltip"
                            title="Send Email"
                            onClick={() => sendEmail(s._id)}
                          >
                            <MdMarkEmailRead />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="d-flex justify-content-center mt-3">
                <ul className="pagination">
                  <li
                    className={`page-item ${currentPage === 1 && "disabled"}`}
                  >
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
      {showModal && selectedSalary && (
        <>
          <div className="modal fade show d-block">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Salary Details</h5>
                  <button className="btn-close" onClick={closeModal}></button>
                </div>
                <div className="modal-body">
                  <p>
                    <strong>Employee:</strong> {selectedSalary.userId?.name}
                  </p>
                  <p>
                    <strong>Employee ID:</strong>{" "}
                    {selectedSalary.userId?.employeeId}
                  </p>
                  <p>
                    <strong>Department:</strong>{" "}
                    {selectedSalary.departmentId?.name}
                  </p>
                  <p>
                    <strong>Month / Year:</strong> {selectedSalary.month}/
                    {selectedSalary.year}
                  </p>
                  <hr />
                  <div className="row">
                    <div className="col-md-6">
                      <h6>Earnings</h6>
                      <ul className="list-group">
                        {Object.entries(selectedSalary.earnings).map(
                          ([key, val]) => (
                            <li
                              key={key}
                              className="list-group-item d-flex justify-content-between"
                            >
                              <span>{capitalizeFirst(key)}</span>
                              <span>₹ {val}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <h6>Deductions</h6>
                      <ul className="list-group">
                        {Object.entries(selectedSalary.deductions).map(
                          ([key, val]) => (
                            <li
                              key={key}
                              className="list-group-item d-flex justify-content-between"
                            >
                              <span>{capitalizeFirst(key)}</span>
                              <span>₹ {val}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                  <hr />
                  <p>
                    <strong>Gross Salary:</strong> ₹{" "}
                    {selectedSalary.grossSalary}
                  </p>
                  <p>
                    <strong>Total Deductions:</strong> ₹{" "}
                    {selectedSalary.totalDeductions}
                  </p>
                  <h5>
                    <strong>Net Salary:</strong> ₹ {selectedSalary.netSalary}
                  </h5>
                </div>

                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={closeModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </>
  );
};

export default SalaryHistory;
