import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const Users = () => {
  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="main-content">
        <div className="row mt-4">
          <div className="col-md-3">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h6>Total Users</h6>
                <h3>—</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;
