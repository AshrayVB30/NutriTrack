import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    age: "",
    weight: "",
    height: "",
    gender: "Male",
    activityLevel: "Moderate",
    dailyCalories: "",
    goal: "Lose Weight",
    foodType: "Omnivore",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDarkMode] = useState(localStorage.getItem("theme") === "dark");

  // Handle input change
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle Profile Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!profile.age || !profile.weight || !profile.height) {
      setError("All fields are required!");
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("✅ Profile Saved:", profile);
      setLoading(false);
      navigate("/welcome"); // Redirect to welcome page
    }, 1000);
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

        .profile-card {
          background-color: var(--card-bg);
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          width: 100%;
          max-width: 500px;
        }

        .profile-title {
          font-size: 2rem;
          font-weight: bold;
          color: var(--text-color);
          text-align: center;
          margin-bottom: 20px;
        }

        .profile-form .form-control, .form-select {
          background-color: var(--element-bg);
          color: var(--text-color);
          border: 1px solid var(--highlight-color);
          border-radius: 12px;
          padding: 12px 15px;
          width: 100%;
          margin-bottom: 15px;
        }

        .profile-form .form-control:focus, .form-select:focus {
          border-color: var(--highlight-color);
          box-shadow: 0 0 8px var(--highlight-color);
          outline: none;
        }

        .error-message {
          color: red;
          font-size: 0.9rem;
          text-align: center;
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
      `}</style>

      {/* Main Section */}
      <section className="background-radial-gradient">
        <div className="profile-card">
          <h2 className="profile-title"></h2>
          {error && <p className="error-message">⚠️ {error}</p>}

          <form onSubmit={handleSubmit} className="profile-form">
            {/* Age */}
            <label className="form-label">🎂 Age</label>
            <input
              type="number"
              name="age"
              placeholder="Enter your age"
              className="form-control"
              value={profile.age}
              onChange={handleChange}
              min="1"
              required
            />

            {/* Weight */}
            <label className="form-label">⚖️ Weight (kg)</label>
            <input
              type="number"
              name="weight"
              placeholder="Enter your weight"
              className="form-control"
              value={profile.weight}
              onChange={handleChange}
              min="1"
              required
            />

            {/* Height */}
            <label className="form-label">📏 Height (cm)</label>
            <input
              type="number"
              name="height"
              placeholder="Enter your height"
              className="form-control"
              value={profile.height}
              onChange={handleChange}
              min="1"
              required
            />

            {/* Gender */}
            <label className="form-label">🚻 Gender</label>
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Male">♂️ Male</option>
              <option value="Female">♀️ Female</option>
              <option value="Other">⚧ Other</option>
            </select>

            {/* Food Type Preference */}
            <label className="form-label">🥗 Food Type Preference</label>
            <select
              name="foodType"
              value={profile.foodType}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Omnivore">🍖 Omnivore - All foods</option>
              <option value="Vegetarian">🥦 Vegetarian - No meat</option>
              <option value="Vegan">🌱 Vegan - Plant-based only</option>
              <option value="Flexitarian">🍏 Flexitarian - Mostly plants</option>
            </select>

            {/* Fitness Goal */}
            <label className="form-label">🏋️ Fitness Goal</label>
            <select
              name="goal"
              value={profile.goal}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Lose Weight">⚡ Lose Weight</option>
              <option value="Maintain Weight">⚖️ Maintain Weight</option>
              <option value="Gain Muscle">💪 Gain Muscle</option>
            </select>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="btn btn-primary btn-lg mt-3"
                disabled={loading}
              >
                {loading ? "⏳ Saving..." : "🚀 Continue"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Profile;
