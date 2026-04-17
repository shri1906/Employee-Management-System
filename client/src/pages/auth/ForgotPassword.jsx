import { useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";
import { sanitizeInput } from "../../utils/Sanitize";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    const sanitizedEmail = sanitizeInput(email).toLowerCase();

    if (!sanitizedEmail) {
      return toast.error("Email is required");
    }

    try {
      setLoading(true);

      await api.post("/auth/forgot-password", {
        email: sanitizedEmail, // ✅ FIXED
      });

      toast.success("Reset link sent to your email");
      setEmail("");
      navigate("/login");
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* LEFT */}
        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center login-left">
          <div className="text-white text-center px-4">
            <h1 className="fw-bold">Forgot Password?</h1>
            <p className="mt-3 fs-5">
              Enter your registered email and we’ll send you a reset link.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div
            className="card shadow-lg p-4"
            style={{ maxWidth: "400px", width: "100%" }}
          >
            <h4 className="text-center mb-4">Forgot Password</h4>

            <form onSubmit={submit}>
              <div className="input-icon mb-3">
                <FaEnvelope />
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) =>
                    setEmail(sanitizeInput(e.target.value))
                  }
                />
              </div>

              <button
                className="btn login-left text-white w-100 mb-3"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              <div className="text-center">
                <Link to="/login" className="text-decoration-none">
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}