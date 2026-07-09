// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import NotificationBell from "./notifications/NotificationBell";
// import "./navbar.css";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, logout } = useContext(AuthContext);

//   const hideOnRoutes = ["/", "/login", "/register"];
//   if (hideOnRoutes.includes(location.pathname)) return null;

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <nav className="navbar">
//       <h2 className="logo">FinanceTracker</h2>

//       <div className="nav-links">
//         {user && (
//           <>
//             <Link to="/dashboard">Dashboard</Link>
//             <Link to="/expenses">Expenses</Link>
//             <Link to="/loans">Loans</Link>
//             <Link to="/payments">Payments</Link>
//             <Link to="/income">Income</Link>
//           </>
//         )}
//       </div>

//       <div className="nav-auth">
//         {user && <NotificationBell />}
//         {user && <button onClick={handleLogout}>Logout</button>}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



     import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "./notifications/NotificationBell";
import "./navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const hideOnRoutes = ["/", "/login", "/register"];
  if (hideOnRoutes.includes(location.pathname)) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-top">
        <h2 className="logo">FinanceTracker</h2>

        <div className="nav-links desktop-links">
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

        <div className="nav-right">
          {user && <NotificationBell />}
          {user && <button className="desktop-logout" onClick={handleLogout}>Logout</button>}
          {user && (
            <button
              className="hamburger-btn"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          )}
        </div>
      </div>

      {user && (
        <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
          <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
          <Link to="/expenses" onClick={closeMenu}>Expenses</Link>
          <Link to="/loans" onClick={closeMenu}>Loans</Link>
          <Link to="/payments" onClick={closeMenu}>Payments</Link>
          <Link to="/income" onClick={closeMenu}>Income</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;