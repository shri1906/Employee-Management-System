import { useState } from "react";
import { login as apiLogin } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user, token } = await apiLogin(email, password);
      login(user, token);
      window.location.href =
        user.role === "admin" ? "/admin" : "/user";
    } catch (err) {
      alert(
        err.response?.data?.message ||
        err.message ||
        "Login failed"
      );
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
            <h1 className="fw-bold">Employee Management System</h1>
            <p className="mt-3 fs-5">
              Secure access to your dashboard and analytics
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="card shadow-lg p-4" style={{ maxWidth: 350 }}>
            <h4 className="text-center fw-bold">
              Employee Management System
            </h4>
            <p className="text-center text-muted mb-4">
              Sign in to continue
            </p>

            <form onSubmit={handleSubmit}>
              <div className="input-icon mb-3">
                <FaEnvelope />
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="input-icon mb-3">
                <FaLock />
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="text-end mb-3">
                <Link to="/forgot-password">Forgot password?</Link>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
