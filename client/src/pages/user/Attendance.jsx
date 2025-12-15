import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const MyAttendance = () => {
  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 w-100">
          <h4>My Attendance</h4>
        </div>
      </div>
    </>
  );
};

export default MyAttendance;
