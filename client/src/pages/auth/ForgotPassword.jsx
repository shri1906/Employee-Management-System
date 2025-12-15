import { useState } from "react";
import api from "../../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const submit = async () => {
    await api.post("/auth/forgot-password", { email });
    alert("Reset link sent to email");
  };

  return (
    <div className="container mt-5 col-md-4">
      <h4>Forgot Password</h4>
      <input className="form-control mb-2"
        placeholder="Email"
        onChange={e => setEmail(e.target.value)} />
      <button className="btn btn-primary" onClick={submit}>Send Link</button>
    </div>
  );
}
