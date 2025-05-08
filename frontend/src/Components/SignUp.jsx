import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../utils/axios";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDarkMode] = useState(localStorage.getItem("theme") === "dark");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const lengthCheck = password.length >= 8;
    const upperCheck = /[A-Z]/.test(password);
    const lowerCheck = /[a-z]/.test(password);
    const numberCheck = /\d/.test(password);
    const specialCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!lengthCheck) return "Password must be at least 8 characters long.";
    if (!upperCheck) return "Password must contain at least one uppercase letter.";
    if (!lowerCheck) return "Password must contain at least one lowercase letter.";
    if (!numberCheck) return "Password must contain at least one number.";
    if (!specialCheck) return "Password must contain at least one special character.";
    return "";
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields are required!");
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/auth/signup", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      // Save user data and token to localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      console.log("✅ Backend response:", response.data);
      
      // Navigate to profile page for new users
      navigate("/profile");
    } catch (err) {
      console.error("❌ Error:", err);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.className = isDarkMode ? "dark-mode" : "";
  }, [isDarkMode]);

  return (
    <>
      <style>{`
        :root {
          --bg-color: ${isDarkMode ? "#081c15" : "#d8f3dc"};
          --element-bg: ${isDarkMode ? "#2d6a4f" : "#95d5b2"};
          --text-color: ${isDarkMode ? "#d8f3dc" : "#081c15"};
          --highlight-color: #52b788;
          --card-bg: ${isDarkMode ? "#1b4332" : "#f8f9fa"};
        }

        body {
          margin: 0;
          padding: 0;
          background-color: var(--bg-color);
          color: var(--text-color);
          font-family: Arial, sans-serif;
          transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
        }

        .background-radial-gradient {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: radial-gradient(
            circle at 50% 50%,
            var(--element-bg),
            var(--bg-color)
          );
        }

        .signup-card {
          background-color: var(--card-bg);
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(10px);
          width: 100%;
          max-width: 500px;
          animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .signup-title {
          font-size: 2rem;
          font-weight: bold;
          color: var(--text-color);
          text-align: center;
          margin-bottom: 20px;
        }

        .signup-form .form-control {
          background-color: var(--element-bg);
          color: var(--text-color);
          border: 1px solid var(--highlight-color);
          border-radius: 12px;
          padding: 12px 15px;
          width: 100%;
          margin-bottom: 15px;
        }

        .signup-form .form-control:focus {
          border-color: var(--highlight-color);
          box-shadow: 0 0 8px var(--highlight-color);
          outline: none;
        }

        .error-message {
          color: red;
          font-size: 0.9rem;
          text-align: center;
          margin-top: -10px;
          margin-bottom: 15px;
        }

        .btn-primary {
          background-color: var(--highlight-color);
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 12px 20px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease-in-out;
        }

        .btn-primary:hover {
          background-color: var(--text-color);
          color: var(--bg-color);
        }

        .login-text {
          margin-top: 15px;
          color: var(--text-color);
        }

        .login-text a {
          color: var(--highlight-color);
          text-decoration: none;
        }

        .login-text a:hover {
          text-decoration: underline;
        }
      `}</style>

      <section className="background-radial-gradient">
        <div className="signup-card">
          <h2 className="signup-title">🚀 Create Your Account</h2>
          {error && <p className="error-message">⚠️ {error}</p>}

          <form onSubmit={handleSignUp} className="signup-form">
            <div className="row">
              <div className="col-md-6 mb-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="👤 First Name"
                  className="form-control"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-4">
                <input
                  type="text"
                  name="lastName"
                  placeholder="👥 Last Name"
                  className="form-control"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <input
              type="email"
              name="email"
              placeholder="📧 Email Address"
              className="form-control mb-3"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="🔐 Password"
              className="form-control mb-3"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="🔒 Confirm Password"
              className="form-control mb-3"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <div className="text-center">
              <button
                type="submit"
                className="btn btn-primary btn-lg mt-3"
                disabled={loading}
              >
                {loading ? "⏳ Signing Up..." : "🚀 Sign Up"}
              </button>
            </div>
          </form>

          <p className="login-text mt-3 text-center">
            Already have an account? <Link to="/signin">Sign In 🔍</Link>
          </p>
        </div>
      </section>
    </>
  );
};

export default SignUp;