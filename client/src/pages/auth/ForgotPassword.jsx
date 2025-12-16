import { useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/auth/forgot-password", { email });
    alert("Reset link sent to your email");
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">

        {/* LEFT BACKGROUND */}
        <div
          className="col-md-6 d-none d-md-flex align-items-center justify-content-center login-left"
        >
          <div className="text-white text-center px-4">
            <h1 className="fw-bold">Forgot Password?</h1>
            <p className="mt-3 fs-5">
              Enter your registered email and we’ll send you a reset link.
            </p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
            <h4 className="text-center mb-4">Reset Password</h4>

            <form onSubmit={submit}>
              <input
                type="email"
                className="form-control mb-3"
                placeholder="Enter your email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />

              <button className="btn btn-primary w-100 mb-3">
                Send Reset Link
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
