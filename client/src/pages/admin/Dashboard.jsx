import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const AdminDashboard = () => {
  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 w-100">
          <h4>Admin Dashboard</h4>
          <div className="row mt-4">
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h6>Users</h6>
                  <h3>—</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h6>Departments</h6>
                  <h3>—</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
