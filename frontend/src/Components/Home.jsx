import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Home = () => {
  const navigate = useNavigate(); // ✅ Initialize navigate

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="hero d-flex justify-content-center align-items-center text-white text-center">
        <div className="container">
          <h1 className="display-3 fw-bold text-shadow">
            Welcome to <span className="text-primary">NutriTrack</span>
          </h1>
          <p className="lead text-light">
            Your nutrition and fitness journey starts here
          </p>
          <button
        type="button"
        className="btn btn-light btn-lg mt-3 btn-hover"
        onClick={() => navigate("/signup")} // ✅ Redirect to /signup
      >
        Get Started
      </button>

        </div>
      </div>

      {/* Introduction Section */}
      <div className="container mt-5 text-center">
        <h2 className="mb-4 fw-bold text-primary">Track Your Nutrition Journey</h2>
        <p className="lead text-muted mb-5">
          NutriTrack is your comprehensive nutrition tracking companion. Monitor your daily intake of calories, 
          protein, carbs, and water with precision. Get real-time insights and stay motivated to achieve your 
          nutritional goals.
        </p>
        <div className="row mt-4">
          <div className="col-md-4 col-sm-12 mb-4">
            <div className="card feature-card shadow-sm p-4">
              <i className="fa fa-utensils fa-3x text-primary mb-3"></i>
              <h4 className="fw-bold">Smart Meal Tracking</h4>
              <p className="text-muted">
                Log your meals with detailed nutritional information. Track calories, protein, and carbs for 
                breakfast, lunch, dinner, and snacks.
              </p>
            </div>
          </div>
          
          <div className="col-md-4 col-sm-12 mb-4">
            <div className="card feature-card shadow-sm p-4">
              <i className="fa fa-chart-line fa-3x text-success mb-3"></i>
              <h4 className="fw-bold">Progress Visualization</h4>
              <p className="text-muted">
                View your nutrition progress through interactive charts. Track daily, weekly, monthly, and yearly 
                trends to understand your eating patterns.
              </p>
            </div>
          </div>

          <div className="col-md-4 col-sm-12 mb-4">
            <div className="card feature-card shadow-sm p-4">
              <i className="fa fa-tint fa-3x text-info mb-3"></i>
              <h4 className="fw-bold">Hydration Tracking</h4>
              <p className="text-muted">
                Monitor your daily water intake with visual progress indicators. Set custom hydration goals and 
                receive reminders to stay hydrated.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;
