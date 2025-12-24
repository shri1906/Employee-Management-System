import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <>
        <Navbar />
        <Sidebar />
        <div className="main-content">
          <p>Loading profile...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Sidebar />

      <div className="main-content">
        <h4 className="mb-4 text-center">My profile</h4>

        <div className="row justify-content-center">
          <div className="col-md-3 col-lg-3">
            <div className="card shadow-sm text-center">
              <div className="card-body">

                {/* PROFILE IMAGE */}
                <img
                  src={
                    user.profileImage
                      ? `${import.meta.env.VITE_LOCALHOST}${user.profileImage}`
                      : "https://via.placeholder.com/150"
                  }
                  alt="Profile"
                  className="rounded-circle mb-3"
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />

                <h5 className="mb-1">{user.name}</h5>
                <p className="text-muted">{user.designation || "Designation not set"}</p>

                <hr />

                {/* DETAILS */}
                <div className="text-start">

                  <p><strong>Employee id:</strong> {user.employeeId || "N/A"}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
                  <p>
                    <strong>Department:</strong>{" "}
                    {user.department?.name || "N/A"}
                  </p>
                  <p><strong>Role:</strong> {user.role}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {user.isActive ? "Active" : "Inactive"}
                  </p>
                  <p>
                    <strong>Joined on:</strong>{" "}
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>

                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default Profile;
