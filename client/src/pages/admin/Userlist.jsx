import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import ConfirmModal from "../../utils/ConfirmModal";

import {
  FaUser,
  FaEnvelope,
  FaUserShield,
  FaBuilding,
  FaIdBadge,
  FaPhone,
} from "react-icons/fa";

import { getUsers, updateUser, getDepartments } from "../../services/api";

const ITEMS_PER_PAGE = 10;

const Userlist = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [profileImage, setProfileImage] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user",
    department: "",
    designation: "",
    phone: "",
  });

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

  const filteredUsers = useMemo(() => {
    let data = [...users];

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (u) =>
          u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }

    if (roleFilter) {
      data = data.filter((u) => u.role === roleFilter);
    }

    if (statusFilter) {
      data = data.filter((u) =>
        statusFilter === "active" ? u.isActive : !u.isActive
      );
    }

    return data;
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const edit = (u) => {
    if (!u.isActive) return;

    setEditingUser(u);
    setForm({
      name: u.name,
      email: u.email,
      role: u.role,
      department: u.department?._id || "",
      designation: u.designation || "",
      phone: u.phone || "",
    });
    setProfileImage(null);
  };

  const submitUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      await updateUser(editingUser._id, formData);

      toast.success("User updated successfully");
      setEditingUser(null);
      setProfileImage(null);

      fetchData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = (user) => {
    if (user.role === "admin" && user.isActive) return;

    if (user.isActive) {
      setPendingUser(user);
      setShowConfirm(true);
    } else {
      updateStatus(user);
    }
  };

  const updateStatus = async (user) => {
    try {
      await updateUser(user._id, { isActive: !user.isActive });
      toast.success(
        `User ${user.isActive ? "deactivated" : "activated"} successfully`
      );
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar />

      <div className="main-content">
        <div className="mb-4">
          <h4>User List</h4>
          <small className="text-muted">Manage system users</small>
          <div>Total Users: {users.length}</div>
        </div>

        <div className="row g-2 mb-3">
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Search name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <select
              className="form-control"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="col-md-3">
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Profile Image</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Employee ID</th>
                    <th>Role</th>
                    <th>Designation</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th width="200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((u) => (
                    <tr
                      key={u._id}
                      className={!u.isActive ? "table-light" : ""}
                    >
                      <td>
                        <img
                          src={`http://localhost:5000${u.profileImage}`}
                          alt="Profile"
                          className="rounded-circle"
                          width="40"
                          height="40"
                        />
                      </td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.employeeId || "-"}</td>
                      <td>{u.role}</td>
                      <td>{u.designation || "-"}</td>
                      <td>{u.department?.name || "-"}</td>
                      <td>
                        <span
                          className={`badge ${
                            u.isActive ? "bg-success" : "bg-secondary"
                          }`}
                        >
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary m-1"
                          disabled={!u.isActive}
                          onClick={() => edit(u)}
                          title={!u.isActive ? "Inactive user" : ""}
                        >
                          Edit
                        </button>

                        <button
                          className={`btn btn-sm m-1 ${
                            u.isActive
                              ? "btn-outline-warning"
                              : "btn-outline-success"
                          }`}
                          disabled={u.role === "admin" && u.isActive}
                          title={
                            u.role === "admin"
                              ? "Admin cannot be inactivated"
                              : ""
                          }
                          onClick={() => toggleStatus(u)}
                        >
                          {u.isActive ? <>Inactivate</> : <>Activate</>}
                        </button>
                      </td>
                    </tr>
                  ))}

                  {paginatedUsers.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Prev
                </button>
                <span className="align-self-center">
                  {page} / {totalPages}
                </span>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {editingUser && (
          <>
            <div className="modal fade show d-block">
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                  <form onSubmit={submitUpdate}>
                    <div className="modal-header">
                      <h5 className="modal-title">Update User</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setEditingUser(null)}
                      ></button>
                    </div>

                    <div className="modal-body row g-3">
                      <div className="col-md-6 input-icon">
                        <FaUser className="mx-2" />
                        <input
                          className="form-control"
                          value={form.name}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="col-md-6 input-icon">
                        <FaEnvelope className="mx-2" />
                        <input
                          className="form-control"
                          value={form.email}
                          disabled
                        />
                      </div>

                      <div className="col-md-6 input-icon">
                        <FaUserShield className="mx-1" />
                        <select
                          className="form-control px-4"
                          value={form.role}
                          onChange={(e) =>
                            setForm({ ...form, role: e.target.value })
                          }
                        >
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
                          value={form.phone}
                          onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                          }
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="file"
                          accept="image/*"
                          className="form-control"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            setProfileImage(file);
                          }}
                        />
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setEditingUser(null)}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="btn login-left text-white"
                        disabled={loading}
                      >
                        {loading ? "Updating..." : "Update User"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="modal-backdrop fade show"></div>
          </>
        )}
      </div>
      <ConfirmModal
        show={showConfirm}
        title="Confirm Inactivation"
        message={`Are you sure you want to inactivate ${pendingUser?.name}?`}
        onConfirm={() => {
          updateStatus(pendingUser);
          setShowConfirm(false);
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
};

export default Userlist;
