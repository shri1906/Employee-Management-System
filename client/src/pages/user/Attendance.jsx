import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const MyAttendance = () => {
  return (
    <>
      <Navbar />
       <Sidebar />
      <div className="main-content">
        <div className="row mt-4">
          <div className="col-md-3">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h4>My Attendance</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyAttendance;
