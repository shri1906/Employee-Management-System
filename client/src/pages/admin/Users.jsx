import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import ConfirmModal from "../../utils/ConfirmModal";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { sanitizeInput } from "../../utils/sanitize";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserShield,
  FaBuilding,
  FaIdBadge,
  FaPhone,
  FaList,
} from "react-icons/fa";

import {
  createUser,
  getDepartments,
  getPendingUsers,
  approveUser,
  rejectUser,
} from "../../services/api";

const Users = () => {
  const [departments, setDepartments] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef();

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmText, setConfirmText] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    department: "",
    designation: "",
    phone: "",
  });

  useEffect(() => {
    getDepartments()
      .then(setDepartments)
      .catch((err) => toast.error(err.message));

    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const res = await getPendingUsers();
      setPendingUsers(res || []);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", sanitizeInput(form.name));
      formData.append("email", sanitizeInput(form.email));
      formData.append("password", form.password); // ❌ never sanitize password
      formData.append("role", form.role);
      formData.append("department", sanitizeInput(form.department));
      formData.append("designation", sanitizeInput(form.designation));
      formData.append("phone", sanitizeInput(form.phone));

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      await createUser(formData);
      toast.success("User created successfully");

      setForm({
        name: "",
        email: "",
        password: "",
        role: "user",
        department: "",
        designation: "",
        phone: "",
      });

      setProfileImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openApproveModal = (id) => {
    const cleanId = sanitizeInput(id);

    setConfirmText("Approve this user and assign an employee ID?");
    setConfirmAction(() => async () => {
      try {
        await approveUser(cleanId);
        toast.success("User approved successfully");
        fetchPendingUsers();
      } catch (err) {
        toast.error(err.message);
      } finally {
        setShowConfirm(false);
      }
    });
    setShowConfirm(true);
  };

  const openRejectModal = (id) => {
    const cleanId = sanitizeInput(id);

    setConfirmText(
      "Reject this registration request? This action cannot be undone."
    );
    setConfirmAction(() => async () => {
      try {
        await rejectUser(cleanId);
        toast.success("User rejected");
        fetchPendingUsers();
      } catch (err) {
        toast.error(err.message);
      } finally {
        setShowConfirm(false);
      }
    });
    setShowConfirm(true);
  };

  return (
    <>
      <Navbar />
      <Sidebar />

      <div className="main-content">
        <div className="mb-4">
          <h4>User Management</h4>
          <small className="text-muted">
            Create users or approve pending registrations
          </small>
        </div>

        <div className="row mb-4 justify-content-end">
          <div className="col-md-2 d-flex justify-content-end">
            <Link
              to="/admin/userlist"
              className="btn login-left text-white d-flex align-items-center gap-2"
            >
              <FaList />
              <span>Userlist</span>
            </Link>
          </div>
        </div>

        {/* CREATE USER */}
        <div className="card shadow-sm mb-5">
          <div className="card-body">
            <h6 className="mb-3">Create User (Admin)</h6>

            <form className="row g-3" onSubmit={submit}>
              <div className="col-md-6 input-icon">
                <FaUser />
                <input
                  className="form-control"
                  placeholder="Full name"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: sanitizeInput(e.target.value) })
                  }
                />
              </div>

              <div className="col-md-6 input-icon">
                <FaEnvelope />
                <input
                  className="form-control"
                  type="email"
                  placeholder="Email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: sanitizeInput(e.target.value) })
                  }
                />
              </div>

              <div className="col-md-6 input-icon">
                <FaLock />
                <input
                  className="form-control"
                  type="password"
                  placeholder="Password"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>

              <div className="col-md-6 input-icon">
                <FaUserShield />
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
                <FaBuilding />
                <select
                  className="form-control px-4"
                  value={form.department}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      department: sanitizeInput(e.target.value),
                    })
                  }
                >
                  <option value="">Select department</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>
                      {sanitizeInput(d.name)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 input-icon">
                <FaIdBadge />
                <input
                  className="form-control px-4"
                  placeholder="Designation"
                  value={form.designation}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      designation: sanitizeInput(e.target.value),
                    })
                  }
                />
              </div>

              <div className="col-md-6 input-icon">
                <FaPhone />
                <input
                  className="form-control"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: sanitizeInput(e.target.value),
                    })
                  }
                />
              </div>

              <div className="col-md-6">
                <input
                  type="file"
                  className="form-control"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => setProfileImage(e.target.files[0])}
                />
              </div>

              <div className="col-12">
                <button
                  className="btn login-left text-white"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create user"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* PENDING USERS */}
        {pendingUsers.length > 0 && (
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="mb-3">Pending registration requests</h6>

              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Photo</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Department</th>
                      <th>Applied on</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingUsers.map((u) => (
                      <tr key={u._id}>
                        <td>
                          <img
                            src={
                              u.profileImage
                                ? `${import.meta.env.VITE_LOCALHOST}${u.profileImage}`
                                : "https://via.placeholder.com/40"
                            }
                            alt="profile"
                            width="40"
                            height="40"
                            className="rounded-circle"
                          />
                        </td>
                        <td>{sanitizeInput(u.name)}</td>
                        <td>{sanitizeInput(u.email)}</td>
                        <td>
                          {sanitizeInput(u.department?.name) || "—"}
                        </td>
                        <td>
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() => openApproveModal(u._id)}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => openRejectModal(u._id)}
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
          </div>
        )}
      </div>

      <ConfirmModal
        show={showConfirm}
        title="Confirmation required"
        message={confirmText}
        onConfirm={confirmAction}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
};

export default Users;
