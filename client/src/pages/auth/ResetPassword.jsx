import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/api";
import { FaLock } from "react-icons/fa";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      return toast.error("All fields are required");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setLoading(true);
      await resetPassword(token, password);
      toast.success("Password reset successful");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">

        {/* LEFT SECTION (SAME AS LOGIN) */}
        <div className="login-left col-md-6 d-none d-md-flex align-items-center justify-content-center text-white">
          <div className="text-center px-4">
            <h1 className="fw-bold">Reset your password</h1>
            <p className="mt-3 fs-5">
              Create a new secure password to access your account
            </p>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="card shadow-lg p-4" style={{ maxWidth: 350 }}>
            <h4 className="text-center fw-bold">
              Employee Management System
            </h4>
            <p className="text-center text-muted mb-4">
              Reset password
            </p>

            <form onSubmit={handleSubmit}>
              <div className="input-icon mb-3">
                <FaLock />
                <input
                  type="password"
                  className="form-control"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="input-icon mb-3">
                <FaLock />
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn login-left text-white w-100"
                disabled={loading}
              >
                {loading ? "Updating..." : "Reset password"}
              </button>
            </form>

            <p className="text-center mt-3">
              Remembered your password?{" "}
              <span
                style={{ cursor: "pointer", color: "#0d6efd" }}
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;
