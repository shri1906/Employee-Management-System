import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <span className="navbar-brand">EMS</span>
      {user && (
        <button className="btn btn-outline-light btn-sm" onClick={logout}>
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;
