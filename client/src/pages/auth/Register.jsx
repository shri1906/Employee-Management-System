import { useEffect, useState, useRef } from "react";
import { registerUser, getDepartmentsRegister } from "../../services/api";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaBuilding,
  FaIdBadge,
  FaImage,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { sanitizeInput } from "../../utils/Sanitize";

const Register = () => {
  const navigate = useNavigate();
  const fileRef = useRef();

  const [departments, setDepartments] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    department: "",
    designation: "",
  });

  useEffect(() => {
    getDepartmentsRegister()
      .then(setDepartments)
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      return toast.error("Required fields missing");
    }

    const cleanForm = {
      name: sanitizeInput(form.name),
      email: sanitizeInput(form.email).toLowerCase(),
      password: form.password.trim(),
      phone: sanitizeInput(form.phone),
      department: form.department,
      designation: sanitizeInput(form.designation),
    };

    const formData = new FormData();
    Object.keys(cleanForm).forEach((k) => formData.append(k, form[k]));
    if (profileImage) formData.append("profileImage", profileImage);

    try {
      setLoading(true);
      const res = await registerUser(formData);
      toast.success(res.message);
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* LEFT */}
        <div className="login-left col-md-6 d-none d-md-flex align-items-center justify-content-center text-white">
          <div className="text-center px-4">
            <h1 className="fw-bold">Apply for access</h1>
            <p className="fs-5 mt-3">Submit your details for admin approval</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="card shadow-lg p-4" style={{ maxWidth: 380 }}>
            <h4 className="text-center fw-bold">User registration</h4>
            <p className="text-center text-muted mb-3">
              All fields are required
            </p>

            <form onSubmit={submit}>
              <div className="input-icon mb-2">
                <FaUser />
                <input
                  className="form-control"
                  name="name"
                  placeholder="Full name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="input-icon mb-2">
                <FaEnvelope />
                <input
                  className="form-control"
                  name="email"
                  placeholder="Email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="input-icon mb-2">
                <FaPhone />
                <input
                  className="form-control"
                  name="phone"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="input-icon mb-2">
                <FaIdBadge />
                <input
                  className="form-control"
                  name="designation"
                  placeholder="Designation"
                  value={form.designation}
                  onChange={handleChange}
                />
              </div>

              <div className="input-icon mb-2">
                <FaBuilding className="" />
                <select
                  className="form-control px-4"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                >
                  <option value="">Select department</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-icon mb-2">
                <FaLock />
                <input
                  className="form-control"
                  name="password"
                  placeholder="Password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <input
                  type="file"
                  className="form-control"
                  ref={fileRef}
                  accept="image/*"
                  onChange={(e) => setProfileImage(e.target.files[0])}
                />
              </div>

              <button
                className="btn login-left text-white w-100"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Apply for registration"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
