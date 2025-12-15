import { useParams } from "react-router-dom";
import { useState } from "react";
import api from "../../services/api";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");

  const submit = async () => {
    await api.post(`/auth/reset-password/${token}`, { password });
    alert("Password reset successful");
    window.location.href = "/login";
  };

  return (
    <div className="container mt-5 col-md-4">
      <h4>Reset Password</h4>
      <input type="password" className="form-control mb-2"
        placeholder="New Password"
        onChange={e => setPassword(e.target.value)} />
      <button className="btn btn-success" onClick={submit}>Reset</button>
    </div>
  );
}
