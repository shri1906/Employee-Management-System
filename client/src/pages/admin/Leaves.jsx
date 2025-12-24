import { useEffect, useState } from "react";
import { getAllLeaves, updateLeaveStatus } from "../../services/api";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await getAllLeaves();
        setLeaves(res.leaves);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchLeaves();
  }, []);

  const update = async (id, status) => {
    try {
      await updateLeaveStatus(id, status);

      // re-fetch after update
      const res = await getAllLeaves();
      setLeaves(res.leaves);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="main-content">
        <div className="mb-4">
          <span className="dashboard-accent"></span>
          <div>
            <h4>Leave Management</h4>
            <small className="text-muted">View and manage leaves</small>
          </div>
        </div>

          
          <div className="table-responsive">
            <table className="table table-bordered table-striped table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>User</th>
                  <th>Leave Type</th>
                  <th>Duration</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((l) => (
                  <tr key={l._id}>
                    <td>{l.userId?.name}</td>
                    <td>{l.leaveType}</td>
                    <td>
                      {new Date(l.startDate).toLocaleDateString()} -
                      {new Date(l.endDate).toLocaleDateString()}
                    </td>
                    <td>{l.reason}</td>
                    <td>{l.status}</td>
                    <td>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => update(l._id, "Approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => update(l._id, "Rejected")}
                      >
                        Reject
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

export default Leaves;
