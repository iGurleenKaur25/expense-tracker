import { useState, useContext } from "react";
import API from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await API.post("/auth/login", {
  //       email,
  //       password,
  //     });
  //     // ✅ STORE AS OBJECT
  //     login({
  //       token: res.data.token, 
        
  //       // 👈 this matches interceptor
  //     });

  //     navigate("/dashboard");
  //   } catch (err) {
  //     setError("Invalid credentials");
  //   }
  // };
  
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await API.post("/auth/login", {
      email,
      password,
    });

    // 🔥 ADD THIS
    console.log("LOGIN RESPONSE:", res.data);

    // ❗ TEMP FIX (we’ll adjust after seeing console)
    login({
      token: res.data.token || res.data.user?.token,
    });

    navigate("/dashboard");
  } catch (err) {
    setError("Invalid credentials");
  }
};
  return (
    <div>
      <h2>Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
