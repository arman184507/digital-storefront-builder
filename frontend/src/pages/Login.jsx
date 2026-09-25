import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: email,
          password: password
        }
      );

      // Save JWT token
      localStorage.setItem(
        "token",
        response.data.token
      );

      // Save logged-in user information
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert(response.data.message);

      navigate("/dashboard");

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Login failed"
      );

    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-logo">
          StoreBuilder
        </div>

        <h1>Welcome back</h1>

        <p className="login-subtitle">
          Login to manage your online store.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="login-input-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-input-group">
            <label>Password</label>

            <div className="login-password-wrapper">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="login-password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "🙈" : "👁️"}
              </button>

            </div>
          </div>

          <div className="login-options">

            <label>
              <input type="checkbox" />
              Remember me
            </label>

            <a href="#">Forgot password?</a>

          </div>

          <button type="submit">
            Login
          </button>

        </form>

        <p className="signup-text">
          Don't have an account?
          <a href="/"> Create one</a>
        </p>

      </div>

    </div>
  );
}

export default Login;