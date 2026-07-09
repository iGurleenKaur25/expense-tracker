
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login.jsx";
import AuthPage from "./components/AuthPage";
// import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard.jsx";
import Expenses from "./pages/Expenses";
import Loans from "./pages/Loans";
import Navbar from "./components/Navbar";
import Payments from "./pages/Payments";
import Income from "./pages/Income"; // NEW

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<AuthPage />} />
        {/* <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/income" element={<Income />} /> {/* NEW */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;