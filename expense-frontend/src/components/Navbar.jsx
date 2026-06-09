// import { Link, useNavigate } from "react-router-dom";
// import "./navbar.css";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <nav className="navbar">
//       <h2 className="logo">FinanceTracker</h2>

//       <div className="nav-links">
//         {token && (
//           <>
//             <Link to="/dashboard">Dashboard</Link>
//             <Link to="/expenses">Expenses</Link>
//             <Link to="/loans">Loans</Link>
//             <Link to="/payments">Payments</Link>
//           </>
//         )}
//       </div>

//       <div className="nav-auth">
//         {token ? (
//           <button onClick={handleLogout}>Logout</button>
//         ) : (
//           <button onClick={() => navigate("/login")}>Login</button>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout(); // ✅ clears localStorage + state
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
          </>
        )}
      </div>

      <div className="nav-auth">
        {user ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <button onClick={() => navigate("/login")}>Login</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;