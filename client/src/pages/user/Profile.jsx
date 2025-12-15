import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const Profile = () => {
  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 w-100">
          <h4>My Profile</h4>
        </div>
      </div>
    </>
  );
};

export default Profile;
