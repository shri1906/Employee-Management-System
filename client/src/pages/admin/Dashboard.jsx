import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const AdminDashboard = () => {
  return (
    <>
      <Navbar />
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="main-content">
        <h4>Admin Dashboard</h4>

        <div className="row mt-4">
          <div className="col-md-3">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h6>Users</h6>
                <h3>—</h3>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h6>Departments</h6>
                <h3>—</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
