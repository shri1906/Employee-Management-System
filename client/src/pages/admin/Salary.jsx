import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const Salary = () => {
  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 w-100">
          <h4>Salary Management</h4>
        </div>
      </div>
    </>
  );
};

export default Salary;
