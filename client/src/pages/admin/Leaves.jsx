import { useEffect, useState } from "react";
import { getAllLeaves, updateLeaveStatus } from "../../services/api";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import ConfirmModal from "../../utils/ConfirmModal";
import { toast } from "react-toastify";
import { sanitizeInput } from "../../utils/sanitize";

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [confirmData, setConfirmData] = useState(null);

  const fetchLeaves = async () => {
    try {
      const res = await getAllLeaves();
      setLeaves(res.leaves || []);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const openConfirm = (id, status) => {
    setConfirmData({ id, status });
  };

  const confirmAction = async () => {
    if (!confirmData) return;

    try {
      await updateLeaveStatus(confirmData.id, confirmData.status);
      toast.success(`Leave ${confirmData.status}`);
      fetchLeaves();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setConfirmData(null);
    }
  };

  const statusBadge = (status) => {
    switch (status) {
      case "Approved":
        return "bg-success";
      case "Rejected":
        return "bg-danger";
      default:
        return "bg-warning text-dark";
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar />

      <div className="main-content">
        <div className="mb-4">
          <h4>Leave Management</h4>
          <small className="text-muted">View and manage leave requests</small>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>User</th>
                <th>Leave Type</th>
                <th>Duration</th>
                <th>Reason</th>
                <th>Status</th>
                <th width="160">Action</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No leave requests found
                  </td>
                </tr>
              ) : (
                leaves.map((l) => {
                  const isFinal = l.status !== "Pending";

                  return (
                    <tr key={l._id}>
                      <td>{sanitizeInput(l.userId?.name || "")}</td>
                      <td>{sanitizeInput(l.leaveType)}</td>
                      <td>
                        {new Date(l.startDate).toLocaleDateString()} –{" "}
                        {new Date(l.endDate).toLocaleDateString()}
                      </td>
                      <td>{sanitizeInput(l.reason)}</td>
                      <td>
                        <span className={`badge ${statusBadge(l.status)}`}>
                          {l.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-success btn-sm"
                            disabled={isFinal}
                            onClick={() =>
                              openConfirm(l._id, "Approved")
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            disabled={isFinal}
                            onClick={() =>
                              openConfirm(l._id, "Rejected")
                            }
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmModal
        show={!!confirmData}
        title="Confirm Action"
        message={`Are you sure you want to ${confirmData?.status?.toLowerCase()} this leave request?`}
        onCancel={() => setConfirmData(null)}
        onConfirm={confirmAction}
      />
    </>
  );
};

export default Leaves;
