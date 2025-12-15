import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const Departments = () => {
  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 w-100">
          <h4>Departments</h4>
          <p>CRUD department UI goes here</p>
        </div>
      </div>
    </>
  );
};

export default Departments;
