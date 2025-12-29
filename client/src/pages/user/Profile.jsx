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
        <div className="main-content text-center mt-4">
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
        <h4 className="mb-4 text-center">My Profile</h4>

        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-6 col-lg-4">
            <div className="card shadow-sm text-center">
              <div className="card-body">
                <img
                  src={
                    user.profileImage
                      ? `${import.meta.env.VITE_LOCALHOST}${user.profileImage}`
                      : "https://via.placeholder.com/150"
                  }
                  alt="Profile"
                  className="rounded-circle img-fluid mb-3"
                  style={{
                    maxWidth: "160px",
                    aspectRatio: "1 / 1",
                    objectFit: "cover",
                  }}
                />

                <h5 className="mb-1">{user.name}</h5>
                <p className="text-muted mb-2">
                  {user.designation || "Designation not set"}
                </p>

                <span
                  className={`badge ${
                    user.isActive ? "bg-success" : "bg-secondary"
                  } mb-3`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>

                <hr />

                {/* DETAILS */}
                <div className="text-start small">

                  <p className="mb-1">
                    <strong>Employee ID:</strong>{" "}
                    {user.employeeId || "N/A"}
                  </p>

                  <p className="mb-1">
                    <strong>Email:</strong> {user.email}
                  </p>

                  <p className="mb-1">
                    <strong>Phone:</strong> {user.phone || "N/A"}
                  </p>

                  <p className="mb-1">
                    <strong>Department:</strong>{" "}
                    {user.department?.name || "N/A"}
                  </p>

                  <p className="mb-1">
                    <strong>Role:</strong> {user.role}
                  </p>

                  <p className="mb-0">
                    <strong>Joined On:</strong>{" "}
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
