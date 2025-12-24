import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { getMySalaries } from "../../services/api";
import { toast } from "react-toastify";

const capitalizeFirst = (text) =>
  text.charAt(0).toUpperCase() + text.slice(1);

const MySalary = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState(null);

  const fetchMySalaries = async () => {
    try {
      setLoading(true);
      const res = await getMySalaries();
      setSalaries(res);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMySalaries();
  }, []);

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
        <h4 className="mb-4">My Salary</h4>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Month</th>
                  <th>Year</th>
                  <th>Net Salary</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {salaries.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No salary records found
                    </td>
                  </tr>
                ) : (
                  salaries.map((s) => (
                    <tr key={s._id}>
                      <td>{s.month}</td>
                      <td>{s.year}</td>
                      <td>₹ {s.netSalary}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => openModal(s)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showModal && selectedSalary && (
        <>
          <div className="modal fade show d-block">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">

                {/* HEADER */}
                <div className="modal-header justify-content-center">
                  <h5 className="modal-title text-center">
                    Salary details
                  </h5>
                  <button
                    className="btn-close position-absolute end-0 me-3"
                    onClick={closeModal}
                  ></button>
                </div>

                {/* BODY */}
                <div className="modal-body">
                  <div className="mb-3">
                    <p>
                      <strong>Month / year:</strong>{" "}
                      {selectedSalary.month}/{selectedSalary.year}
                    </p>
                  </div>

                  <hr />

                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="text-center mb-2">Earnings</h6>
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
                      <h6 className="text-center mb-2">Deductions</h6>
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
                    <strong>Gross salary:</strong> ₹ {selectedSalary.grossSalary}
                  </p>
                  <p>
                    <strong>Total deductions:</strong> ₹{" "}
                    {selectedSalary.totalDeductions}
                  </p>
                  <h5>
                    <strong>Net salary:</strong> ₹ {selectedSalary.netSalary}
                  </h5>
                </div>

                {/* FOOTER */}
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

export default MySalary;
