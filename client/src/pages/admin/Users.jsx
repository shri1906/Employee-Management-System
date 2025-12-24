import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

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

import { createUser, getDepartments } from "../../services/api";

const Users = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  // const [preview, setPreview] = useState(null);
  const fileInputRef = useRef();

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
  }, []);

  const submit = async (e) => {
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
      // setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
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
            <h4>User Management</h4>
            <small className="text-muted">Add a new system user</small>
          </div>
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

        <div className="card shadow-sm">
          <div className="card-body">
            <h6 className="mb-3">User Details</h6>

            <form className="row g-3" onSubmit={submit}>
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
                  placeholder="Password"
                  required
                  value={form.password}
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
              <div className="col-md-6 ">
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setProfileImage(file);
                    // setPreview(URL.createObjectURL(file));
                  }}
                />
              </div>
              {/* {preview && (
                <div className="mt-2 d-flex justify-content-center">
                  <img
                    src={preview}
                    alt="preview"
                    className="rounded"
                    width="100"
                    height="100"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )} */}

              <div className="col-12">
                <button
                  className="btn login-left text-white w-40"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;
