import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { getUserDashboardStats } from "../../services/api";
import { Link } from "react-router-dom";

import {
  FaCalendarCheck,
  FaMoneyBillWave,
  FaUserClock,
  FaBriefcase,
  FaCalendarAlt,
  FaUser,
} from "react-icons/fa";

const UserDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    getUserDashboardStats().then(setData);
  }, []);

  if (!data) return <p className="p-4">Loading...</p>;

  const { attendanceSummary, workingDays, leaveTaken, latestSalary } = data;

  const cardConfig = [
    {
      title: "Working Days",
      value: workingDays,
      icon: <FaBriefcase size={32}  />,
      gradient: "card-gradient-1",
    },
    {
      title: "Present Days",
      value: attendanceSummary.Present,
      icon: <FaCalendarCheck size={32} />,
      gradient: "card-gradient-2",
    },
    {
      title: "Leaves Taken",
      value: leaveTaken,
      icon: <FaUserClock size={32} />,
      gradient: "card-gradient-3",
    },
    {
      title: "Last Salary",
      value: latestSalary ? `₹ ${latestSalary.netSalary}` : "N/A",
      icon: <FaMoneyBillWave size={32} />,
      gradient: "card-gradient-4",
    },
  ];

  return (
    <>
      <Navbar />
      <Sidebar />

      <div className="main-content">
        <h2>My Dashboard</h2>
        <p className="text-muted">Your work summary at a glance</p>

        {/* SUMMARY CARDS */}
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

        {/* ATTENDANCE SUMMARY */}
        <div className="row mt-5">
          <div className="col-md-6">
            <h5>This Month Attendance</h5>
            <ul className="list-group">
              {Object.entries(attendanceSummary).map(([k, v]) => (
                <li
                  key={k}
                  className="list-group-item d-flex justify-content-between"
                >
                  <span>{k}</span>
                  <strong>{v}</strong>
                </li>
              ))}
            </ul>
          </div>

          {/* SALARY DETAILS */}
          <div className="col-md-6">
            <h5>Latest Salary</h5>
            {latestSalary ? (
              <div className="card shadow-sm">
                <div className="card-body">
                  <p>
                    <strong>Month:</strong> {latestSalary.month}/
                    {latestSalary.year}
                  </p>
                  <p>
                    <strong>Net Salary:</strong> ₹ {latestSalary.netSalary}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted">No salary generated yet</p>
            )}
          </div>
        </div>

        {/* QUICK ACTIONS */}

        <div className="row mt-4 g-2">
          <div className="col-12 col-md-auto">
            <Link to="/user/attendance" className="btn btn-primary w-100 ">
              <FaCalendarAlt className="text-white me-1 ic-align" />
              <span>View Attendance</span>
            </Link>
          </div>
          <div className="col-12 col-md-auto">
            <Link to="/user/salary" className="btn btn-warning w-100">
              <FaMoneyBillWave className="text-dark me-1 ic-align" />
              <span>View Salary</span>
            </Link>
          </div>
          <div className="col-12 col-md-auto">
            <Link to="/user/profile" className="btn btn-success w-100">
              <FaUser className="text-white me-1 ic-align" />
              <span>My Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
