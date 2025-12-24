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

  const handleEarningChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      earnings: { ...prev.earnings, [key]: Number(value) },
    }));
  };

  const handleDeductionChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      deductions: { ...prev.deductions, [key]: Number(value) },
    }));
  };

  const submitSalary = async () => {
    if (!form.userId || !form.departmentId || !form.month || !form.year) {
      return toast.error("All fields are required");
    }

    try {
      setLoading(true);
      await generateSalary(form);
      toast.success("Salary generated successfully");
      fetchSalaries();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

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
          <span className="dashboard-accent"></span>
          <div>
            <h4>Salary Management</h4>
            <small className="text-muted">Add salary</small>
          </div>
        </div>
          <div className="card mb-4">
            <div className="card-header fw-bold">Generate Salary</div>
            <div className="card-body row g-3">

              <div className="col-md-3">
                <label>User</label>
                <select
                  className="form-select"
                  onChange={(e) =>
                    setForm({ ...form, userId: e.target.value })
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
                  onChange={(e) =>
                    setForm({ ...form, departmentId: e.target.value })
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
                  className="form-control"
                  placeholder="MM"
                  onChange={(e) =>
                    setForm({ ...form, month: e.target.value })
                  }
                />
              </div>

              <div className="col-md-2">
                <label>Year</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="YYYY"
                  onChange={(e) =>
                    setForm({ ...form, year: e.target.value })
                  }
                />
              </div>

              {/* Earnings */}
              <div className="col-12 mt-3 fw-bold">Earnings</div>
              {Object.keys(form.earnings).map((k) => (
                <div className="col-md-2" key={k}>
                  <input
                    className="form-control"
                    placeholder={k}
                    onChange={(e) => handleEarningChange(k, e.target.value)}
                  />
                </div>
              ))}

              {/* Deductions */}
              <div className="col-12 mt-3 fw-bold">Deductions</div>
              {Object.keys(form.deductions).map((k) => (
                <div className="col-md-2" key={k}>
                  <input
                    className="form-control"
                    placeholder={k}
                    onChange={(e) => handleDeductionChange(k, e.target.value)}
                  />
                </div>
              ))}

              <div className="col-12">
                <button
                  className="btn login-left text-white"
                  onClick={submitSalary}
                  disabled={loading}
                >
                  Generate Salary
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
                    <td>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => downloadSlip(s._id)}
                      >
                        Download
                      </button>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => emailSlip(s._id)}
                      >
                        Email
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </>
  );
};

export default Salary;
