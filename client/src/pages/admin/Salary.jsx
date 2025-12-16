import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const Salary = () => {
  return (
    <>
      <Navbar />
       <Sidebar />
      <div className="main-content">
       <h4>Salary Management</h4>
        <div className="row mt-4">
          <div className="col-md-3">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h6>Total Salaries Processed</h6>
                <h3>—</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Salary;
