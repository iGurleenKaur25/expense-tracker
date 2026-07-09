import { useState, useEffect, useContext } from "react";
import API from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./AuthPage.css";

const AuthPage = () => {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", userType: "general" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tickerValue, setTickerValue] = useState(0);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const targetValue = 84250;

  // animated ledger balance on mount — signature element
  useEffect(() => {
    // let start = 0;
    const duration = 1400;
    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setTickerValue(Math.floor(eased * targetValue));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setForm({ name: "", email: "", password: "", confirmPassword: "", userType: "general" });
  };

  const validate = () => {
    if (!form.email || !form.password) return "Email and password are required.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Enter a valid email address.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    if (mode === "signup") {
      if (!form.name.trim()) return "Name is required.";
      if (form.password !== form.confirmPassword) return "Passwords do not match.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (mode === "login") {
        const res = await API.post("/auth/login", {
          email: form.email,
          password: form.password,
        });
        localStorage.setItem("token", res.data.token);
        login(res.data.user);
        navigate("/dashboard");
      } else {
        const res = await API.post("/auth/register", {
          name: form.name,
          email: form.email,
          password: form.password,
          userType: form.userType,
        });
        localStorage.setItem("token", res.data.token);
        login(res.data.user);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* LEFT — ledger panel */}
      <div className="auth-ledger">
        <div className="ledger-lines" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => (
            <div className="ledger-line" key={i} />
          ))}
        </div>

        <div className="ledger-content">
          <span className="ledger-eyebrow">Personal Finance Tracker</span>
          <h1 className="ledger-headline">
            Every rupee,
            <br />
            accounted for.
          </h1>
          <p className="ledger-sub">
            Track expenses, manage loans, and see exactly where your money goes — in one place.
          </p>

          <div className="ledger-ticker">
            <span className="ticker-label">Sample tracked balance</span>
            <span className="ticker-value">
              ₹{tickerValue.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT — form panel */}
      <div className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-toggle" role="tablist" aria-label="Login or Sign up">
            <button
              role="tab"
              aria-selected={mode === "login"}
              className={mode === "login" ? "toggle-btn active" : "toggle-btn"}
              onClick={() => switchMode("login")}
              type="button"
            >
              Log in
            </button>
            <button
              role="tab"
              aria-selected={mode === "signup"}
              className={mode === "signup" ? "toggle-btn active" : "toggle-btn"}
              onClick={() => switchMode("signup")}
              type="button"
            >
              Sign up
            </button>
            <span className={`toggle-indicator ${mode}`} aria-hidden="true" />
          </div>

          <h2 className="auth-card-title">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="auth-card-sub">
            {mode === "login"
              ? "Log in to see your latest ledger."
              : "Start tracking in under a minute."}
          </p>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {mode === "signup" && (
              <div className="form-field">
                <label htmlFor="name">Full name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Gurleen Kaur"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>
            )}

            {mode === "signup" && (
              <div className="form-field">
                <label>I am a</label>
                <div className="user-type-row">
                  <button
                    type="button"
                    className={`user-type-btn${form.userType === "general" ? " active" : ""}`}
                    onClick={() => setForm({ ...form, userType: "general" })}
                  >
                    General User
                  </button>
                  <button
                    type="button"
                    className={`user-type-btn${form.userType === "student" ? " active" : ""}`}
                    onClick={() => setForm({ ...form, userType: "student" })}
                  >
                    Student
                  </button>
                </div>
              </div>
            )}

            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div className="form-field">
              <label htmlFor="password">Password</label>
              <div className="password-wrap">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  className="show-pass-btn"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <div className="form-field">
                <label htmlFor="confirmPassword">Confirm password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </div>
            )}

            {mode === "login" && (
              <div className="forgot-row">
                <a href="/forgot-password">Forgot password?</a>
              </div>
            )}

            {error && <div className="auth-error" role="alert">{error}</div>}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
            </button>
          </form>

          <p className="auth-switch-text">
            {mode === "login" ? "New here?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="switch-link"
              onClick={() => switchMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login" ? "Create an account" : "Log in instead"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
