import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "./notifications/NotificationBell";
import "./navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const hideOnRoutes = ["/", "/login", "/register"];
  if (hideOnRoutes.includes(location.pathname)) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2 className="logo">FinanceTracker</h2>

      <div className="nav-links">
        {user && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/expenses">Expenses</Link>
            <Link to="/loans">Loans</Link>
            <Link to="/payments">Payments</Link>
            <Link to="/income">Income</Link>
          </>
        )}
      </div>

      <div className="nav-auth">
        {user && <NotificationBell />}
        {user && <button onClick={handleLogout}>Logout</button>}
      </div>
    </nav>
  );
};

export default Navbar;