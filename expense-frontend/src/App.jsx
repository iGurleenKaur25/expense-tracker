import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard.jsx";
import Expenses from "./pages/Expenses";
import Loans from "./pages/Loans";
import Navbar from "./components/Navbar";
import Payments from "./pages/Payments";

function App() {
  return (
    
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/loans" element={<Loans />} />
       <Route path="/payments" element={<Payments />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
