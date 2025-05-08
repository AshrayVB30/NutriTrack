import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    age: "",
    weight: "",
    height: "",
    gender: "Male",
    goal: "Lose Weight",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [goalOptions, setGoalOptions] = useState([
    "Lose Weight",
    "Maintain Weight",
    "Gain Muscle",
  ]);
  const [goalMessage, setGoalMessage] = useState("");
  const [isDarkMode] = useState(localStorage.getItem("theme") === "dark");

  const updateGoalOptions = (age, weight, gender, height) => {
    let options = [];
    age = Number(age);
    weight = Number(weight);

    if (age <= 10) {
      options = ["Maintain Weight"];
    } else if (age <= 20) {
      options = weight < 60 ? ["Lose Weight", "Maintain Weight"] : ["Maintain Weight", "Gain Muscle"];
    } else if (age <= 40) {
      options = weight < 70 ? ["Lose Weight", "Maintain Weight", "Gain Muscle"] : ["Maintain Weight", "Gain Muscle"];
    } else if (age <= 60) {
      options = ["Maintain Weight", "Lose Weight"];
    } else {
      options = ["Maintain Weight"];
    }

    setGoalOptions(options);
    if (!options.includes(profile.goal)) {
      setProfile((prev) => ({ ...prev, goal: options[0] }));
    }

    // BMI calculation for extra message
    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);

    let bmiMsg = "";
    if (bmi < 18.5) bmiMsg = "Underweight";
    else if (bmi < 24.9) bmiMsg = "Healthy";
    else if (bmi < 29.9) bmiMsg = "Overweight";
    else bmiMsg = "Obese";

    setGoalMessage(`Based on your BMI (${bmi.toFixed(1)}), you are ${bmiMsg}. Recommended goals: ${options.join(", ")}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedProfile = { ...profile, [name]: value };
    setProfile(updatedProfile);

    if (["age", "weight", "gender", "height"].includes(name)) {
      const { age, weight, gender, height } = updatedProfile;
      if (age && weight && height) {
        updateGoalOptions(age, weight, gender, height);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile.age || !profile.weight || !profile.height) {
      setError("All fields are required!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/auth/profile', {
        ...profile
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log("✅ Profile Saved:", response.data.profile);
      setLoading(false);
      
      // New users create a profile and then go to welcome page
      navigate("/welcome");
    } catch (error) {
      console.error("❌ Error saving profile:", error);
      setError(error.response?.data?.message || "Failed to save profile");
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.className = isDarkMode ? "dark-mode" : "";
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
    }
  }, [isDarkMode, navigate]);

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
        }
        .background-radial-gradient {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: radial-gradient(circle at 50% 50%, var(--element-bg), var(--bg-color));
        }
        .profile-card {
          background-color: var(--card-bg);
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 500px;
        }
        .profile-title {
          font-size: 2rem;
          font-weight: bold;
          text-align: center;
          margin-bottom: 20px;
        }
        .form-control, .form-select {
          background-color: var(--element-bg);
          color: var(--text-color);
          border: 1px solid var(--highlight-color);
          border-radius: 12px;
          padding: 12px 15px;
          width: 100%;
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
        }
        .btn-primary:hover {
          background-color: var(--text-color);
          color: var(--bg-color);
        }
        .error-message {
          color: red;
          font-size: 0.9rem;
          text-align: center;
          margin-bottom: 15px;
        }
        .goal-message {
          font-size: 0.9rem;
          color: var(--text-color);
          background-color: var(--element-bg);
          padding: 10px;
          border-radius: 10px;
          margin-bottom: 15px;
        }
      `}</style>

      <section className="background-radial-gradient">
        <div className="profile-card">
          <h2 className="profile-title">👤 Your Profile</h2>
          {error && <p className="error-message">⚠️ {error}</p>}
          {goalMessage && <p className="goal-message">📊 {goalMessage}</p>}

          <form onSubmit={handleSubmit} className="profile-form">
            <label className="form-label">🎂 Age</label>
            <input type="number" name="age" placeholder="Enter your age" className="form-control" value={profile.age} onChange={handleChange} min="1" required />

            <label className="form-label">⚖️ Weight (kg)</label>
            <input type="number" name="weight" placeholder="Enter your weight" className="form-control" value={profile.weight} onChange={handleChange} min="1" required />

            <label className="form-label">📏 Height (cm)</label>
            <input type="number" name="height" placeholder="Enter your height" className="form-control" value={profile.height} onChange={handleChange} min="1" required />

            <label className="form-label">🚻 Gender</label>
            <select name="gender" value={profile.gender} onChange={handleChange} className="form-select">
              <option value="Male">♂️ Male</option>
              <option value="Female">♀️ Female</option>
              <option value="Other">⚧ Other</option>
            </select>

            <label className="form-label">🏋️ Fitness Goal</label>
            <select name="goal" value={profile.goal} onChange={handleChange} className="form-select">
              {goalOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>

            <div className="text-center">
              <button type="submit" className="btn btn-primary btn-lg mt-3" disabled={loading}>
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