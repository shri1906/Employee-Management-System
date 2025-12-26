import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { getAdminDashboardStats } from "../../services/api";
import { Link } from "react-router-dom";

import {
  FaUsers,
  FaBuilding,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUserClock,
  FaPlus,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    getAdminDashboardStats().then(setData);
  }, []);

  if (!data) return <p className="p-4">Loading...</p>;

  const { cards, attendanceSummary, salarySummary } = data;

  return (
    <>
      <Navbar />
      <Sidebar />

      <div className="main-content">
        <h2>Dashboard Overview</h2>
        <p className="text-muted">A quick glance at system statistics</p>

        {/* CARDS */}
        <div className="row g-4 mt-3">
          {[
            {
              title: "Total Users",
              value: cards.totalUsers,
              icon: <FaUsers size={30} className="text-primary" />,
              link: "/admin/userlist",
            },
            {
              title: "Departments",
              value: cards.totalDepartments,
              icon: <FaBuilding size={30} className="text-success" />,
              link: "/admin/departments",
            },
            {
              title: "Pending Leaves",
              value: cards.pendingLeaves,
              icon: <FaCalendarAlt size={30} className="text-warning" />,
              link: "/admin/leaves",
            },
            {
              title: "Salary Records",
              value: cards.totalSalaries,
              icon: <FaMoneyBillWave size={30} className="text-danger" />,
              link: "/admin/salary-history",
            },
            {
              title: "Pending Registrations",
              value: cards.pendingRegistrations,
              icon: <FaUserClock size={30} className="text-warning" />,
              link: "/admin/users",
            },
          ].map((c, i) => (
            <div className="col-md-3" key={i}>
              <Link to={c.link} className="text-decoration-none text-dark">
                <div className="card shadow-sm border-0 text-center dashboard-card">
                  <div className="card-body">
                    <div className="mb-2">{c.icon}</div>
                    <h6>{c.title}</h6>
                    <h3>{c.value}</h3>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* ATTENDANCE + SALARY */}
        <div className="row mt-5">
          <div className="col-md-6">
            <h5>Today's Attendance</h5>
            <ul className="list-group">
              {Object.entries(attendanceSummary).map(([k, v]) => (
                <li
                  className="list-group-item d-flex justify-content-between"
                  key={k}
                >
                  <span>{k}</span>
                  <strong>{v}</strong>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-md-6">
            <h5>This Month's Salary</h5>
            <ul className="list-group">
              <li className="list-group-item d-flex justify-content-between">
                Generated
                <strong>{salarySummary.generated}</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                Total Payout
                <strong>₹ {salarySummary.totalPayout}</strong>
              </li>
            </ul>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="row mt-4 g-2">
          <div className="col-12 col-md-auto">
            <Link className="btn btn-primary w-100 ">
              <FaPlus className="text-white me-1 ic-align" />
              <span>Add User</span>
            </Link>
          </div>
          <div className="col-12 col-md-auto">
            <Link className="btn btn-warning w-100">
              <FaCalendarAlt className="text-dark me-1 ic-align" />
              <span>Mark Attendance</span>
            </Link>
          </div>
          <div className="col-12 col-md-auto">
            <Link className="btn btn-success w-100">
              <FaMoneyBillWave className="text-white me-1 ic-align" />
              <span>Generate Salary</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
