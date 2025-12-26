import { useEffect, useState } from "react";
import { applyLeave, myLeaves } from "../../services/api";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { toast } from "react-toastify";

const MyLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    leaveType: "Sick",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchLeaves = async () => {
    try {
      const res = await myLeaves();
      setLeaves(res.leaves);
    } catch (err) {
      toast.error(err.message || "Failed to load leaves");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    // 🔴 Validation
    if (!form.startDate || !form.endDate || !form.reason) {
      toast.warning("Please fill all required fields");
      return;
    }

    if (!user?.department) {
      toast.error("Department not assigned. Contact admin.");
      return;
    }

    try {
      setLoading(true);

      await applyLeave({
        ...form,
        departmentId: user.department, // ✅ auto attach
      });

      toast.success("Leave applied successfully");

      setForm({
        leaveType: "Sick",
        startDate: "",
        endDate: "",
        reason: "",
      });

      fetchLeaves();
    } catch (err) {
      toast.error(err.message || "Leave application failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar />

      <div className="main-content mt-4">
        <h4 className="mb-3">My Leaves</h4>

        {/* APPLY LEAVE */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-dark text-white">
            Apply Leave
          </div>

          <form onSubmit={submit} className="card-body row g-3">
            <div className="col-md-4">
              <label className="form-label">Leave Type</label>
              <select
                className="form-select"
                value={form.leaveType}
                onChange={(e) =>
                  setForm({ ...form, leaveType: e.target.value })
                }
              >
                <option>Sick</option>
                <option>Casual</option>
                <option>Annual</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                value={form.endDate}
                min={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, endDate: e.target.value })
                }
              />
            </div>

            <div className="col-12">
              <label className="form-label">Reason</label>
              <textarea
                className="form-control"
                rows="2"
                value={form.reason}
                onChange={(e) =>
                  setForm({ ...form, reason: e.target.value })
                }
              ></textarea>
            </div>

            <div className="col-12 text-end">
              <button
                className="btn login-left text-white"
                disabled={loading}
              >
                {loading ? "Applying..." : "Apply Leave"}
              </button>
            </div>
          </form>
        </div>

        {/* MY LEAVES */}
        <div className="card shadow-sm">
          <div className="card-header bg-dark text-white">
            My Leave History
          </div>

          <div className="card-body table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No leave records found
                    </td>
                  </tr>
                ) : (
                  leaves.map((l) => (
                    <tr key={l._id}>
                      <td>{l.leaveType}</td>
                      <td>{new Date(l.startDate).toLocaleDateString()}</td>
                      <td>{new Date(l.endDate).toLocaleDateString()}</td>
                      <td>
                        <span
                          className={`badge ${
                            l.status === "Approved"
                              ? "bg-success"
                              : l.status === "Rejected"
                              ? "bg-danger"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyLeaves;
