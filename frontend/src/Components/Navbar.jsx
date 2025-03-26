import React, { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Apply Theme to the Entire Page
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode"); // Apply to <body>
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);
  

  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container d-flex justify-content-between align-items-center">
        {/* Theme Toggle Button on the Left */}
        <button
  className="btn theme-toggle"
  onClick={() => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
  }}
>
  {isDarkMode ? (
    <i className="fas fa-sun text-warning"></i>
  ) : (
    <i className="fas fa-moon text-dark"></i>
  )}
</button>


        {/* Brand Logo - Centered */}
        <Link className="navbar-brand mx-auto fw-bold" to="/">
          NutriTrack
        </Link>

        {/* Navbar Toggler with Rotation */}
        <button
          className={`navbar-toggler ${isNavOpen}`}
          type="button"
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className={`collapse navbar-collapse ${isNavOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto text-center">
            <li className="nav-item">
              <Link className="nav-link btn-signup" to="/signup">
                Sign Up
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link btn-signup" to="/signin">
                Sign In
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
