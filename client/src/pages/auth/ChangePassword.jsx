import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { changePassword } from "../../services/api";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast.error("All fields are required");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match");
    }

    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setLoading(true);
      await changePassword(oldPassword, newPassword);
      toast.success("Password changed successfully");

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
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

      {/* MAIN CONTENT */}
      <div className="main-content d-flex justify-content-center align-items-center" style={{ minHeight: "calc(100vh - 64px)" }}>
        <div className="col-md-3 col-lg-3">
          <div className="card shadow-sm">
            <div className="card-body">
               <h4 className="text-center mb-4">Change password</h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-1">
                  <label className="form-label">Old password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>

                <div className="mb-1">
                  <label className="form-label">New password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="mb-1">
                  <label className="form-label">Confirm new password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn login-left text-white w-100 mt-2"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Change password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
