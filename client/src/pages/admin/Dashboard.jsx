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
  const cardConfig = [
    {
      title: "Total Users",
      value: cards.totalUsers,
      icon: <FaUsers size={32} />,
      link: "/admin/userlist",
      gradient: "card-gradient-1",
    },
    {
      title: "Departments",
      value: cards.totalDepartments,
      icon: <FaBuilding size={32} />,
      link: "/admin/departments",
      gradient: "card-gradient-2",
    },
    {
      title: "Pending Leaves",
      value: cards.pendingLeaves,
      icon: <FaCalendarAlt size={32} />,
      link: "/admin/leaves",
      gradient: "card-gradient-3",
    },
    {
      title: "Salary Records",
      value: cards.totalSalaries,
      icon: <FaMoneyBillWave size={32} />,
      link: "/admin/salary-history",
      gradient: "card-gradient-4",
    },
    {
      title: "Pending Registrations",
      value: cards.pendingRegistrations,
      icon: <FaUserClock size={32} />,
      link: "/admin/users",
      gradient: "card-gradient-5",
    },
  ];

  return (
    <>
      <Navbar />
      <Sidebar />

      <div className="main-content">
        <h2>Dashboard Overview</h2>
        <p className="text-muted">A quick glance at system statistics</p>

        {/* CARDS */}
        <div className="row g-4 mt-3">
          {cardConfig.map((c, i) => (
            <div className="col-md-3" key={i}>
              <Link to={c.link} className="text-decoration-none">
                <div className={`cards dashboard-card shadow ${c.gradient}`}>
                  <div className="card-body text-center">
                    <div className="mb-2">{c.icon}</div>
                    <h6 className="fw-semibold">{c.title}</h6>
                    <h2 className="fw-bold">{c.value}</h2>
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
            <Link to="/admin/users" className="btn btn-primary w-100 ">
              <FaPlus className="text-white me-1 ic-align" />
              <span>Add User</span>
            </Link>
          </div>
          <div className="col-12 col-md-auto">
            <Link to="/admin/attendance" className="btn btn-warning w-100">
              <FaCalendarAlt className="text-dark me-1 ic-align" />
              <span>Mark Attendance</span>
            </Link>
          </div>
          <div className="col-12 col-md-auto">
            <Link to="/admin/salary" className="btn btn-success w-100">
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
