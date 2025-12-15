import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import AdminDashboard from "./pages/admin/Dashboard";
import Departments from "./pages/admin/Departments";
import Users from "./pages/admin/Users";
import Salary from "./pages/admin/Salary";
import Attendance from "./pages/admin/Attendance";

import UserDashboard from "./pages/user/Dashboard";
import Profile from "./pages/user/Profile";
import MySalary from "./pages/user/Salary";
import MyAttendance from "./pages/user/Attendance";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== PUBLIC ROUTES ===== */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ===== ADMIN ROUTES ===== */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/departments"
          element={
            <ProtectedRoute role="admin">
              <Departments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/salary"
          element={
            <ProtectedRoute role="admin">
              <Salary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/attendance"
          element={
            <ProtectedRoute role="admin">
              <Attendance />
            </ProtectedRoute>
          }
        />

        {/* ===== USER ROUTES ===== */}
        <Route
          path="/user"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute role="user">
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/salary"
          element={
            <ProtectedRoute role="user">
              <MySalary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/attendance"
          element={
            <ProtectedRoute role="user">
              <MyAttendance />
            </ProtectedRoute>
          }
        />

        {/* ===== DEFAULT / FALLBACK ===== */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
