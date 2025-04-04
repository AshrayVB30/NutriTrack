import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDarkMode] = useState(localStorage.getItem("theme") === "dark");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Password Validation Function
  const validatePassword = (password) => {
    const minLength = /.{8,}/;
    const upperCase = /[A-Z]/;
    const lowerCase = /[a-z]/;
    const number = /\d/;
    const specialChar = /[!@#$%^&*]/;

    return (
      minLength.test(password) &&
      upperCase.test(password) &&
      lowerCase.test(password) &&
      number.test(password) &&
      specialChar.test(password)
    );
  };

  // Handle Manual Sign-In
  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("⚠️ Both email and password are required!");
      return;
    }

    if (!validatePassword(formData.password)) {
      setError(
        "🔒 Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character."
      );
      return;
    }

    setLoading(true);

    try {
      // Connect to the backend
      const response = await axios.post('http://localhost:5000/api/users/signin', {
        email: formData.email,
        password: formData.password
      });      
      
      // Save user data and token to localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      console.log("✅ User Signed In:", response.data.user);
      navigate("/profile");
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setError(error.response?.data?.message || "❌ Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Login
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      
      // Decode the Google credential to get user info
      const decoded = jwt_decode(credentialResponse.credential);
      
      // Send Google info to your backend
      const response = await axios.post('http://localhost:5000/api/users/google-auth', {
        name: decoded.name,
        email: decoded.email,
        googleId: decoded.sub,
        profilePicture: decoded.picture
      });
      
      // Save user data and token to localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      console.log("✅ Google User:", response.data.user);
      navigate('/profile');
    } catch (error) {
      console.error("Google login error:", error);
      setError("❌ Google Sign-In Failed! Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Apply Theme on Load
  useEffect(() => {
    document.body.className = isDarkMode ? "dark-mode" : "";
  }, [isDarkMode]);

  return (
    <>
      <style>{`
        /* Global Theme Variables */
        :root {
          --bg-color: ${isDarkMode ? "#081c15" : "#d8f3dc"};
          --element-bg: ${isDarkMode ? "#2d6a4f" : "#95d5b2"};
          --text-color: ${isDarkMode ? "#d8f3dc" : "#081c15"};
          --highlight-color: #52b788;
          --card-bg: ${isDarkMode ? "#1b4332" : "#f8f9fa"};
        }

        /* Body & Background */
        body {
          margin: 0;
          padding: 0;
          background-color: var(--bg-color);
          color: var(--text-color);
          font-family: "Arial", sans-serif;
          transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
        }

        /* Page Layout */
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

        /* Sign-In Card */
        .signin-card {
          background-color: var(--card-bg);
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          width: 100%;
          max-width: 500px;
        }

        .signin-title {
          font-size: 2rem;
          font-weight: bold;
          color: var(--text-color);
          text-align: center;
          margin-bottom: 20px;
        }

        .motivational-quote {
          font-size: 1rem;
          color: var(--highlight-color);
          text-align: center;
          margin-bottom: 20px;
          font-style: italic;
        }

        /* Form Styles */
        .signin-form .form-control {
          background-color: var(--element-bg);
          color: var(--text-color);
          border: 1px solid var(--highlight-color);
          border-radius: 12px;
          padding: 12px 15px;
          width: 100%;
          margin-bottom: 15px;
        }

        .signin-form .form-control:focus {
          border-color: var(--highlight-color);
          box-shadow: 0 0 8px var(--highlight-color);
          outline: none;
        }

        /* Error Message */
        .error-message {
          color: red;
          font-size: 0.9rem;
          text-align: center;
          margin-top: -10px;
          margin-bottom: 15px;
        }

        /* Sign In Button */
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

        /* Social Buttons */
        .social-buttons {
          margin-top: 20px;
        }

        /* Signup Text */
        .signup-text {
          margin-top: 15px;
          color: var(--text-color);
        }

        .signup-text a {
          color: var(--highlight-color);
          text-decoration: none;
        }

        .signup-text a:hover {
          text-decoration: underline;
        }

        /* Emojis */
        .form-control::placeholder {
          font-size: 1rem;
          opacity: 0.8;
        }
      `}</style>

      {/* Main Section */}
      <section className="background-radial-gradient">
        <div className="signin-card">
          <h2 className="signin-title">👋 Welcome Back!</h2>
          <p className="motivational-quote">"Every step you take is one step closer to your goal. Keep going! 🌟"</p>

          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleSignIn} className="signin-form">
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

            <div className="text-center">
              <button
                type="submit"
                className="btn btn-primary btn-lg mt-3"
                disabled={loading}
              >
                {loading ? "⏳ Signing In..." : "🚀 Sign In"}
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p>✨ or sign in with:</p>
            <div className="social-buttons">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  setError("❌ Google Sign-In Failed! Try again.");
                }}
              />
            </div>
          </div>

          <p className="signup-text mt-3 text-center">
            Don't have an account? <Link to="/signup">📝 Sign Up</Link>
          </p>
        </div>
      </section>
    </>
  );
};

export default SignIn;