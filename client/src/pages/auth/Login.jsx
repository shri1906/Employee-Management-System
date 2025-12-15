import { useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

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
    <form onSubmit={handleSubmit} className="container mt-5 col-md-4">
      <h3>Login</h3>
      <input className="form-control mb-2" placeholder="Email"
        onChange={e => setEmail(e.target.value)} />
      <input type="password" className="form-control mb-2" placeholder="Password"
        onChange={e => setPassword(e.target.value)} />
      <button className="btn btn-primary w-100">Login</button>
    </form>
  );
};

export default Login;
