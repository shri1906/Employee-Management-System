import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const Profile = () => {
  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="main-content">
        <div className="row mt-4">
          <div className="col-md-3">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h4>My Profile</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
