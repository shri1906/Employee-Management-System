import { useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await api.post("/auth/login", { email, password });
    login(res.data.user, res.data.token);
    window.location.href = res.data.user.role === "admin" ? "/admin" : "/user";
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* LEFT BACKGROUND */}
        <div className="login-left col-md-6 d-none d-md-flex align-items-center justify-content-center text-white">
          <div className="text-center px-4">
            <h1 className="fw-bold">Welcome Back !</h1>
            <p className="mt-3 fs-5">
              Login to access your dashboard and manage your account.
            </p>
          </div>
        </div>

        {/* RIGHT LOGIN FORM */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div
            className="card shadow-lg p-4"
            style={{ width: "100%", maxWidth: "400px" }}
          >
            <h3 className="text-center mb-4">Login</h3>

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                className="form-control mb-3"
                placeholder="Email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                className="form-control mb-3"
                placeholder="Password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="text-end mb-3">
                <Link to="/forgot-password" className="text-decoration-none">
                  Forgot password?
                </Link>
              </div>

              <button className="btn btn-primary w-100">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
