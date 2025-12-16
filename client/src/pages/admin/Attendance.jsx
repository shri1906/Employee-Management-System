import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const Attendance = () => {
  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="main-content">
        <h4>Attendance Management</h4>
        <div className="row mt-4">
          <div className="col-md-3">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h6>Present Today</h6>
                <h3>—</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h6>Absent Today</h6>
                <h3>—</h3>
              </div>
            </div>
          </div>       
        </div>
      </div>
    </>
  );
};

export default Attendance;
