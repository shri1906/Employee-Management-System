import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import ConfirmModal from "../../utils/ConfirmModal";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserShield,
  FaBuilding,
  FaIdBadge,
  FaPhone
} from "react-icons/fa";

import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  getDepartments,
} from "../../services/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    department: "",
    designation: "",
    phone: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchData = async () => {
    try {
      const [userData, deptData] = await Promise.all([
        getUsers(),
        getDepartments(),
      ]);

      setUsers(userData);
      setDepartments(deptData);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await updateUser(editingId, form);
        toast.success("User updated successfully");
      } else {
        await createUser(form);
        toast.success("User created successfully");
      }

      resetForm();
      fetchData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      role: "user",
      department: "",
      designation: "",
      phone: "",
    });
    setEditingId(null);
  };

  const edit = (u) => {
    setForm({
      name: u.name || "",
      email: u.email || "",
      password: "",
      role: u.role || "user",
      department: u.department?._id || "",
      designation: u.designation || "",
      phone: u.phone || "",
    });
    setEditingId(u._id);
  };

  const remove = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(deleteId);
      toast.success("User deleted successfully");
      fetchData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar />

      <div className="main-content">
        {/* HEADER */}
        <div className="mb-4">
          <span className="dashboard-accent"></span>
          <div>
            <h4>Users</h4>
            <small className="text-muted">
              Create, update & manage system users
            </small>
          </div>
        </div>

        {/* STATS */}
        <div className="row mb-4">
          <div className="col-md-3 col-sm-6">
            <div className="card stat-card shadow-sm">
              <div className="card-body">
                <h6 className="text-muted">Total Users</h6>
                <h3 className="fw-bold mb-0">{users.length}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h6 className="mb-3">
              {editingId ? "Update User" : "Create User"}
            </h6>

            <form className="row g-3" onSubmit={submit}>
              {/* LEFT COLUMN */}
              <div className="col-md-6 input-icon">
                <FaUser className="mx-2" />
                <input
                  className="form-control"
                  placeholder="Full Name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="col-md-6 input-icon">
                <FaEnvelope className="mx-2" />
                <input
                  className="form-control"
                  type="email"
                  placeholder="Email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="col-md-6 input-icon">
                <FaLock className="mx-2" />
                <input
                  className="form-control"
                  type="password"
                  placeholder={
                    editingId ? "New Password (optional)" : "Password"
                  }
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>

              <div className="col-md-6 input-icon"> 
                <FaUserShield className="mx-1" />
                <select
                  className="form-control px-4"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="">Select Role</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="col-md-6 input-icon">
                <FaBuilding className="mx-1" />
                <select
                  className="form-control px-4"
                  value={form.department}
                  onChange={(e) =>
                    setForm({ ...form, department: e.target.value })
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

              <div className="col-md-6 input-icon">
                <FaIdBadge className="mx-2" />
                <input
                  className="form-control"
                  placeholder="Designation"
                  value={form.designation}
                  onChange={(e) =>
                    setForm({ ...form, designation: e.target.value })
                  }
                />
              </div>

              <div className="col-md-6 input-icon">
                <FaPhone className="mx-2" />
                <input
                  className="form-control"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              {/* SUBMIT BUTTON */}
              <div className="col-12">
                <button className="btn login-left text-white w-40" disabled={loading}>
                  {loading
                    ? "Saving..."
                    : editingId
                    ? "Update User"
                    : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* LIST */}
        <div className="card shadow-sm">
          <div className="card-body">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Active</th>
                  <th width="140">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.department?.name || "-"}</td>
                    <td>
                      <span
                        className={`badge ${
                          u.isActive ? "bg-success" : "bg-secondary"
                        }`}
                      >
                        {u.isActive ? "Yes" : "No"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => edit(u)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => remove(u._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CONFIRM DELETE */}
      <ConfirmModal
        show={showConfirm}
        title="Confirm Delete"
        message="Are you sure you want to delete this user?"
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
};

export default AdminUsers;
