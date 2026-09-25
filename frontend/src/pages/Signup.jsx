import { useState } from "react";
import axios from "axios";
import "./Signup.css";

function Signup() {

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          full_name: fullName,
          email: email,
          password: password,
          business_name: businessName
        }
      );

      alert(response.data.message);

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Registration failed"
      );
    }
  };

  return (

    <div className="signup-page">
      <div className="signup-container">

        <div className="signup-left">
          <div className="brand">
            StoreBuilder
          </div>

          <div className="left-content">
            <h1>
              Build your online store.
              <span> Sell with confidence.</span>
            </h1>

            <p>
              Create a beautiful online storefront for your business
              without needing technical skills.
            </p>

            <div className="features">
              <div>✓ Easy store setup</div>
              <div>✓ Manage your products</div>
              <div>✓ Accept customer orders</div>
            </div>
          </div>
        </div>

        <div className="signup-right">
          <div className="signup-card">

            <h2>Create your account</h2>

            <p className="subtitle">
              Start building your online store today.
            </p>

            <form onSubmit={handleSubmit}>

              <div className="input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                  
                  
                
              </div>

              <div className="input-group">
                <label>Email Address</label>
                <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              </div>

              <div className="input-group">
                <label>Password</label>
                <div className="password-wrapper">
                <input
                 type={showPassword ? "text" : "password"}
                 placeholder="Create a password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
                />

                <button
                 type="button"
                 className="password-toggle"
                 onClick={() => setShowPassword(!showPassword)}
                >
                {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              </div>

              <div className="input-group">
                <label>Business Name</label>
                <input
                 type="text"
                 placeholder="Enter your business name"
                 value={businessName}
                 onChange={(e) => setBusinessName(e.target.value)}
                 required
                />
              </div>

              <button type="submit">
                Create Account
              </button>

            </form>

            <p className="login-text">
              Already have an account?
              <a href="/login"> Login</a>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Signup;