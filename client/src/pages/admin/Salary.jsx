import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import {
  generateSalary,
  getAllSalaries,
  getUsers,
  getDepartments,
  downloadSalarySlip,
  emailSalarySlip,
} from "../../services/api";
import { toast } from "react-toastify";
import { FaFileDownload } from "react-icons/fa";
import { MdMarkEmailRead } from "react-icons/md";
import { sanitizeInput } from "../../utils/sanitize";

const Salary = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    userId: "",
    departmentId: "",
    month: "",
    year: "",
    earnings: {
      basic: 0,
      hra: 0,
      conveyance: 0,
      medical: 0,
      specialAllowance: 0,
    },
    deductions: {
      pf: 0,
      esi: 0,
      tax: 0,
      other: 0,
    },
  });

  useEffect(() => {
    getUsers().then(setUsers);
    getDepartments().then(setDepartments);
    fetchSalaries();
  }, []);

  const fetchSalaries = async () => {
    try {
      const res = await getAllSalaries();
      setSalaries(res);
    } catch (err) {
      toast.error(err.message);
    }
  };

  /* ================= SAFE NUMBER HANDLER ================= */
  const safeNumber = (value) => Math.max(0, Number(value) || 0);

  const handleEarningChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      earnings: {
        ...prev.earnings,
        [key]: safeNumber(value),
      },
    }));
  };

  const handleDeductionChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      deductions: {
        ...prev.deductions,
        [key]: safeNumber(value),
      },
    }));
  };

  /* ================= SUBMIT SALARY ================= */
  const submitSalary = async () => {
    const payload = {
      ...form,
      userId: sanitizeInput(form.userId),
      departmentId: sanitizeInput(form.departmentId),
      month: Number(form.month),
      year: Number(form.year),
    };

    if (!payload.userId || !payload.departmentId) {
      return toast.error("User and Department are required");
    }

    if (payload.month < 1 || payload.month > 12) {
      return toast.error("Invalid month");
    }

    if (payload.year.toString().length !== 4) {
      return toast.error("Invalid year");
    }

    try {
      setLoading(true);
      await generateSalary(payload);
      toast.success("Salary generated successfully");
      fetchSalaries();
    } catch (err) {
      toast.error(err.message || "Failed to generate salary");
    } finally {
      setLoading(false);
    }
  };

  /* ================= ACTIONS ================= */
  const downloadSlip = async (id) => {
    const res = await downloadSalarySlip(id);
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = "SalarySlip.pdf";
    a.click();
  };

  const emailSlip = async (id) => {
    await emailSalarySlip(id);
    toast.success("Salary slip emailed");
  };

  return (
    <>
      <Navbar />
      <Sidebar />

      <div className="main-content">
        <div className="mb-4">
          <h4>Salary Management</h4>
          <small className="text-muted">Generate and manage salaries</small>
        </div>

        {/* ================= GENERATE SALARY ================= */}
        <div className="card mb-4">
          <div className="card-header fw-bold bg-dark text-light">
            Generate Salary
          </div>

          <div className="card-body row g-3">
            <div className="col-md-3">
              <label>User</label>
              <select
                className="form-select"
                value={form.userId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    userId: sanitizeInput(e.target.value),
                  })
                }
              >
                <option value="">Select User</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label>Department</label>
              <select
                className="form-select"
                value={form.departmentId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    departmentId: sanitizeInput(e.target.value),
                  })
                }
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <label>Month</label>
              <input
                type="number"
                min="1"
                max="12"
                className="form-control"
                value={form.month}
                onChange={(e) =>
                  setForm({
                    ...form,
                    month: Number(sanitizeInput(e.target.value)),
                  })
                }
              />
            </div>

            <div className="col-md-2">
              <label>Year</label>
              <input
                type="number"
                className="form-control"
                value={form.year}
                onChange={(e) =>
                  setForm({
                    ...form,
                    year: Number(sanitizeInput(e.target.value)),
                  })
                }
              />
            </div>

            <div className="col-12 mt-3 fw-bold">Earnings</div>
            {Object.keys(form.earnings).map((k) => (
              <div className="col-md-2" key={k}>
                <input
                  className="form-control"
                  placeholder={k}
                  onChange={(e) =>
                    handleEarningChange(k, e.target.value)
                  }
                />
              </div>
            ))}

            <div className="col-12 mt-3 fw-bold">Deductions</div>
            {Object.keys(form.deductions).map((k) => (
              <div className="col-md-2" key={k}>
                <input
                  className="form-control"
                  placeholder={k}
                  onChange={(e) =>
                    handleDeductionChange(k, e.target.value)
                  }
                />
              </div>
            ))}

            <div className="col-12">
              <button
                className="btn login-left text-white"
                onClick={submitSalary}
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate Salary"}
              </button>
            </div>
          </div>
        </div>

        {/* ================= SALARY HISTORY ================= */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5>Salary History</h5>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate("/admin/salary-history")}
          >
            View All
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>User</th>
                <th>Department</th>
                <th>Month</th>
                <th>Year</th>
                <th>Net Salary</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {salaries.slice(0, 5).map((s) => (
                <tr key={s._id}>
                  <td>{s.userId?.name}</td>
                  <td>{s.departmentId?.name}</td>
                  <td>{s.month}</td>
                  <td>{s.year}</td>
                  <td>₹ {s.netSalary}</td>
                  <td className="d-flex gap-1">
                    <button
                      className="btn btn-sm btn-primary"
                      title="Download Slip"
                      onClick={() => downloadSlip(s._id)}
                    >
                      <FaFileDownload />
                    </button>

                    <button
                      className="btn btn-sm btn-success"
                      title="Email Slip"
                      onClick={() => emailSlip(s._id)}
                    >
                      <MdMarkEmailRead />
                    </button>
                  </td>
                </tr>
              ))}

              {salaries.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No salary records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Salary;
