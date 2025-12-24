import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "../../utils/ConfirmModal";
import { FaBuilding, FaBarcode } from "react-icons/fa";

import {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
} from "../../services/api";

const ITEMS_PER_PAGE = 5;

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
      setCurrentPage(1);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await updateDepartment(editingId, name, code);
        toast.success("Department updated successfully");
      } else {
        await createDepartment(name, code);
        toast.success("Department created successfully");
      }

      setName("");
      setCode("");
      setEditingId(null);
      fetchDepartments();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const edit = (dept) => {
    setName(dept.name);
    setCode(dept.code);
    setEditingId(dept._id);
  };

  const remove = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDepartment(deleteId);
      toast.success("Department deleted successfully");
      fetchDepartments();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  const totalPages = Math.ceil(departments.length / ITEMS_PER_PAGE);

  const paginatedDepartments = departments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <Navbar />
      <Sidebar />

      <div className="main-content">
        <div className="">
          <h4>Departments</h4>
          <small className="text-muted">
            Create, update & manage departments
          </small>
        </div>
        <div className="mb-4">Total Departments: {departments.length}</div>
        <div className="mb-4">
          <h6 className="mb-3">
            {editingId ? "Update Department" : "Create Department"}
          </h6>

          <form className="row g-3" onSubmit={submit}>
            <div className="col-md-4 input-icon">
              <FaBuilding className="mx-2" />
              <input
                className="form-control"
                placeholder="Department Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="col-md-4 input-icon">
              <FaBarcode className="mx-2" />
              <input
                className="form-control"
                placeholder="Department Code"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <button
                type="submit"
                className="btn login-left text-white w-100"
                disabled={loading}
              >
                {loading ? "Saving..." : editingId ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>

        <div className="table-responsive">
          <div>
            <table className="table table-bordered table-striped align-middle text-nowrap">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Code</th>
                  <th>Status</th>
                  <th width="140">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDepartments.map((d) => (
                  <tr key={d._id}>
                    <td>{d.name}</td>
                    <td>{d.code}</td>
                    <td>
                      <span
                        className={`badge ${
                          d.isActive ? "bg-success" : "bg-secondary"
                        }`}
                      >
                        {d.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex flex-column flex-md-row gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary w-100 w-md-auto"
                          onClick={() => edit(d)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger w-100 w-md-auto"
                          onClick={() => remove(d._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {paginatedDepartments.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
                      No departments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="d-flex justify-content-end align-items-center gap-2 mt-3">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Prev
                </button>

                <span className="text-muted">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  className="btn btn-sm btn-outline-secondary"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        show={showConfirm}
        title="Confirm Delete"
        message="Are you sure you want to delete this department?"
        onCancel={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default Departments;
