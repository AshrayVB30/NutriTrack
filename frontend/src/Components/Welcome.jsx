import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";

// Register chart elements
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Welcome = () => {
  const [isDarkMode] = useState(localStorage.getItem("theme") === "dark");

  // Water Intake States
  const [waterIntake, setWaterIntake] = useState(0);
  const [waterInput, setWaterInput] = useState(0);
  const [waterTarget, setWaterTarget] = useState(2000); // Default target of 2000ml (2L)
  const [waterTargetInput, setWaterTargetInput] = useState(2000);

  // Protein Intake States
  const [proteinIntake, setProteinIntake] = useState(0);
  const [proteinInput, setProteinInput] = useState(0);
  const [proteinTarget, setProteinTarget] = useState(150); // Default target of 150g
  const [proteinTargetInput, setProteinTargetInput] = useState(150);

  // Carbs Intake States
  const [carbsIntake, setCarbsIntake] = useState(0);
  const [carbsInput, setCarbsInput] = useState(0);
  const [carbsTarget, setCarbsTarget] = useState(250); // Default target of 250g
  const [carbsTargetInput, setCarbsTargetInput] = useState(250);

  // Meal Logging States
  const [mealLogs, setMealLogs] = useState({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: [],
  });

  const [mealInput, setMealInput] = useState({
    Breakfast: { name: "", calories: 0, protein: 0, carbs: 0 },
    Lunch: { name: "", calories: 0, protein: 0, carbs: 0 },
    Dinner: { name: "", calories: 0, protein: 0, carbs: 0 },
    Snacks: { name: "", calories: 0, protein: 0, carbs: 0 },
  });

  // Calorie Goal & Total Calories State
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const totalCaloriesConsumed = Object.values(mealLogs).reduce(
    (total, mealArray) =>
      total + mealArray.reduce((sum, meal) => sum + meal.calories, 0),
    0
  );
  const remainingCalories = calorieGoal - totalCaloriesConsumed;

  // Progress Data for Chart
  const [timePeriod, setTimePeriod] = useState("day"); // day, week, month, year
  const [progressData, setProgressData] = useState({
    labels: [],
    datasets: [
      {
        label: "Calories",
        data: [],
        borderColor: "#ff6b6b",
        backgroundColor: "rgba(255, 107, 107, 0.2)",
        tension: 0.4
      },
      {
        label: "Protein (g)",
        data: [],
        borderColor: "#48cae4",
        backgroundColor: "rgba(72, 202, 228, 0.2)",
        tension: 0.4
      },
      {
        label: "Carbs (g)",
        data: [],
        borderColor: "#ffba08",
        backgroundColor: "rgba(255, 186, 8, 0.2)",
        tension: 0.4
      },
      {
        label: "Water (ml)",
        data: [],
        borderColor: "#52b788",
        backgroundColor: "rgba(82, 183, 136, 0.2)",
        tension: 0.4
      }
    ],
  });

  // Generate labels based on time period
  const generateLabels = (period) => {
    const now = new Date();
    const labels = [];
    
    switch(period) {
      case "day":
        // Generate hourly labels for current day
        for (let i = 0; i < 24; i++) {
          labels.push(`${i}:00`);
        }
        break;
      case "week":
        // Generate daily labels for current week
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        for (let i = 0; i < 7; i++) {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + i);
          labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        }
        break;
      case "month":
        // Generate weekly labels for current month
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const weeksInMonth = Math.ceil((now.getDate() + startOfMonth.getDay()) / 7);
        for (let i = 0; i < weeksInMonth; i++) {
          labels.push(`Week ${i + 1}`);
        }
        break;
      case "year":
        // Generate monthly labels for current year
        for (let i = 0; i < 12; i++) {
          labels.push(new Date(now.getFullYear(), i).toLocaleDateString('en-US', { month: 'short' }));
        }
        break;
      default:
        labels.push("Today");
    }
    return labels;
  };

  // Generate data based on time period
  const generateData = (period) => {
    const data = [];
    const baseValue = {
      calories: totalCaloriesConsumed,
      protein: proteinIntake,
      carbs: carbsIntake,
      water: waterIntake
    };

    switch(period) {
      case "day":
        // Generate hourly data for current day
        for (let i = 0; i < 24; i++) {
          data.push({
            calories: Math.round(baseValue.calories * (i / 24)),
            protein: Math.round(baseValue.protein * (i / 24)),
            carbs: Math.round(baseValue.carbs * (i / 24)),
            water: Math.round(baseValue.water * (i / 24))
          });
        }
        break;
      case "week":
        // Generate daily data for current week
        for (let i = 0; i < 7; i++) {
          data.push({
            calories: Math.round(baseValue.calories * (i / 7)),
            protein: Math.round(baseValue.protein * (i / 7)),
            carbs: Math.round(baseValue.carbs * (i / 7)),
            water: Math.round(baseValue.water * (i / 7))
          });
        }
        break;
      case "month":
        // Generate weekly data for current month
        const weeksInMonth = Math.ceil((new Date().getDate() + new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay()) / 7);
        for (let i = 0; i < weeksInMonth; i++) {
          data.push({
            calories: Math.round(baseValue.calories * (i / weeksInMonth)),
            protein: Math.round(baseValue.protein * (i / weeksInMonth)),
            carbs: Math.round(baseValue.carbs * (i / weeksInMonth)),
            water: Math.round(baseValue.water * (i / weeksInMonth))
          });
        }
        break;
      case "year":
        // Generate monthly data for current year
        for (let i = 0; i < 12; i++) {
          data.push({
            calories: Math.round(baseValue.calories * (i / 12)),
            protein: Math.round(baseValue.protein * (i / 12)),
            carbs: Math.round(baseValue.carbs * (i / 12)),
            water: Math.round(baseValue.water * (i / 12))
          });
        }
        break;
      default:
        data.push({
          calories: baseValue.calories,
          protein: baseValue.protein,
          carbs: baseValue.carbs,
          water: baseValue.water
        });
    }
    return data;
  };

  // Update chart data whenever time period changes
  useEffect(() => {
    const labels = generateLabels(timePeriod);
    const data = generateData(timePeriod);

    setProgressData({
      labels: labels,
      datasets: [
        {
          label: "Calories",
          data: data.map(d => d.calories),
          borderColor: "#ff6b6b",
          backgroundColor: "rgba(255, 107, 107, 0.2)",
          tension: 0.4
        },
        {
          label: "Protein (g)",
          data: data.map(d => d.protein),
          borderColor: "#48cae4",
          backgroundColor: "rgba(40, 209, 77, 0.2)",
          tension: 0.4
        },
        {
          label: "Carbs (g)",
          data: data.map(d => d.carbs),
          borderColor: "#ffba08",
          backgroundColor: "rgba(255, 186, 8, 0.2)",
          tension: 0.4
        },
        {
          label: "Water (ml)",
          data: data.map(d => d.water),
          borderColor: "#52b788",
          backgroundColor: "rgba(82, 183, 136, 0.2)",
          tension: 0.4
        }
      ],
    });
  }, [timePeriod, totalCaloriesConsumed, proteinIntake, carbsIntake, waterIntake]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Nutrition Progress Overview"
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Amount"
        }
      },
      x: {
        title: {
          display: true,
          text: "Time Period"
        }
      }
    }
  };

  // Function to add a new meal
  const addMeal = (mealType) => {
    const { name, calories, protein, carbs } = mealInput[mealType];

    if (name.trim() !== "" && calories > 0) {
      setMealLogs({
        ...mealLogs,
        [mealType]: [...mealLogs[mealType], { name, calories, protein, carbs }],
      });

      // Update total protein and carbs intake
      setProteinIntake(proteinIntake + protein);
      setCarbsIntake(carbsIntake + carbs);

      // Reset input after adding
      setMealInput({
        ...mealInput,
        [mealType]: { name: "", calories: 0, protein: 0, carbs: 0 },
      });
    } else {
      alert("Please enter valid meal details!");
    }
  };

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
          background-color: var(--bg-color);
          color: var(--text-color);
        }
        .section-container {
          padding: 2rem;
        }
        .card {
          background-color: var(--card-bg);
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          margin-top: 1rem;
        }
        .btn-primary {
          background-color: var(--highlight-color);
        }
      `}</style>

      <div className="container section-container">
        {/* App Header */}
        <h1 className="text-center mb-4"></h1>

        {/* Daily Intake Section */}
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <h3>🔥 Daily Calorie Intake</h3>
              <p>
                Calories Consumed: <strong>{totalCaloriesConsumed} kcal</strong> / Target: <strong>{calorieGoal} kcal</strong>
              </p>
              <div className="progress mb-2">
                <div 
                  className="progress-bar" 
                  role="progressbar" 
                  style={{
                    width: `${Math.min((totalCaloriesConsumed / calorieGoal) * 100, 100)}%`,
                    backgroundColor: remainingCalories < 0 ? '#dc3545' : 'var(--highlight-color)'
                  }}
                  aria-valuenow={totalCaloriesConsumed}
                  aria-valuemin="0"
                  aria-valuemax={calorieGoal}
                />
              </div>

              {/* Calorie Progress Messages */}
              <div className="alert alert-info mb-2">
                {totalCaloriesConsumed < calorieGoal * 0.25 && (
                  <>🍽️ Starting your day! Remember to eat balanced meals.</>
                )}
                {totalCaloriesConsumed >= calorieGoal * 0.25 && totalCaloriesConsumed < calorieGoal * 0.5 && (
                  <>🥗 Good start! Keep making healthy choices.</>
                )}
                {totalCaloriesConsumed >= calorieGoal * 0.5 && totalCaloriesConsumed < calorieGoal * 0.75 && (
                  <>🥪 Halfway through your daily goal! Keep it up!</>
                )}
                {totalCaloriesConsumed >= calorieGoal * 0.75 && totalCaloriesConsumed < calorieGoal && (
                  <>🍳 Almost at your goal! Choose your remaining meals wisely.</>
                )}
                {totalCaloriesConsumed >= calorieGoal && totalCaloriesConsumed <= calorieGoal * 1.1 && (
                  <>🎯 Perfect! You've hit your calorie goal!</>
                )}
                {totalCaloriesConsumed > calorieGoal * 1.1 && (
                  <>⚠️ You've exceeded your calorie goal - consider adjusting your intake.</>
                )}
              </div>

              {totalCaloriesConsumed < calorieGoal && (
                <p className="text-info mb-3">
                  You have {remainingCalories} kcal remaining for today.
                </p>
              )}

              {/* Calorie Goal Input */}
              <div className="mb-3">
                <label className="form-label">Set Daily Calorie Goal</label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter Calorie Goal"
                    value={calorieGoal}
                    onChange={(e) => setCalorieGoal(Number(e.target.value))}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      alert(`Calorie goal set to ${calorieGoal} kcal!`)
                    }
                  >
                    Set Goal
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Protein Intake Section */}
          <div className="col-md-6">
            <div className="card">
              <h3>💪 Daily Protein Intake</h3>
              <p>
                Protein Consumed: <strong>{proteinIntake} g</strong> / Target: <strong>{proteinTarget} g</strong>
              </p>
              <div className="progress mb-2">
                <div 
                  className="progress-bar" 
                  role="progressbar" 
                  style={{
                    width: `${Math.min((proteinIntake / proteinTarget) * 100, 100)}%`,
                    backgroundColor: 'var(--highlight-color)'
                  }}
                  aria-valuenow={proteinIntake}
                  aria-valuemin="0"
                  aria-valuemax={proteinTarget}
                />
              </div>

              {/* Protein Progress Messages */}
              <div className="alert alert-info mb-2">
                {proteinIntake < proteinTarget * 0.25 && (
                  <>🥚 Time to fuel your body! Start with a protein-rich meal.</>
                )}
                {proteinIntake >= proteinTarget * 0.25 && proteinIntake < proteinTarget * 0.5 && (
                  <>🥩 Good progress! Keep adding protein to your meals.</>
                )}
                {proteinIntake >= proteinTarget * 0.5 && proteinIntake < proteinTarget * 0.75 && (
                  <>🍗 Halfway to your protein goal! Your muscles will thank you!</>
                )}
                {proteinIntake >= proteinTarget * 0.75 && proteinIntake < proteinTarget && (
                  <>🥜 Almost there! A protein snack away from your goal!</>
                )}
                {proteinIntake >= proteinTarget && proteinIntake <= proteinTarget * 1.2 && (
                  <>💪 Amazing! You've reached your protein goal!</>
                )}
                {proteinIntake > proteinTarget * 1.2 && (
                  <>⚠️ You've exceeded your protein target significantly - consider balancing your intake.</>
                )}
              </div>

              {proteinIntake < proteinTarget && (
                <p className="text-info mb-3">
                  You need {proteinTarget - proteinIntake}g more protein to reach your goal.
                </p>
              )}

              {/* Protein Goal Input */}
              <div className="mb-3">
                <label className="form-label">Set Daily Protein Goal (g)</label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter Protein Goal"
                    value={proteinTargetInput}
                    onChange={(e) => setProteinTargetInput(Number(e.target.value))}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      if (proteinTargetInput > 0) {
                        setProteinTarget(proteinTargetInput);
                        alert(`Protein goal set to ${proteinTargetInput}g!`);
                      } else {
                        alert("Please enter a valid target amount.");
                      }
                    }}
                  >
                    Set Goal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carbs Intake Section */}
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <h3>🍞 Daily Carbs Intake</h3>
              <p>
                Carbs Consumed: <strong>{carbsIntake} g</strong> / Target: <strong>{carbsTarget} g</strong>
              </p>
              <div className="progress mb-2">
                <div 
                  className="progress-bar" 
                  role="progressbar" 
                  style={{
                    width: `${Math.min((carbsIntake / carbsTarget) * 100, 100)}%`,
                    backgroundColor: 'var(--highlight-color)'
                  }}
                  aria-valuenow={carbsIntake}
                  aria-valuemin="0"
                  aria-valuemax={carbsTarget}
                />
              </div>

              {/* Carbs Progress Messages */}
              <div className="alert alert-info mb-2">
                {carbsIntake < carbsTarget * 0.25 && (
                  <>🍞 Start your day with some healthy carbs!</>
                )}
                {carbsIntake >= carbsTarget * 0.25 && carbsIntake < carbsTarget * 0.5 && (
                  <>🥖 Good progress! Keep adding complex carbs to your meals.</>
                )}
                {carbsIntake >= carbsTarget * 0.5 && carbsIntake < carbsTarget * 0.75 && (
                  <>🍚 Halfway to your carbs goal! Choose whole grains when possible.</>
                )}
                {carbsIntake >= carbsTarget * 0.75 && carbsIntake < carbsTarget && (
                  <>🥔 Almost there! A healthy carb snack away from your goal!</>
                )}
                {carbsIntake >= carbsTarget && carbsIntake <= carbsTarget * 1.2 && (
                  <>🎯 Perfect! You've reached your carbs goal!</>
                )}
                {carbsIntake > carbsTarget * 1.2 && (
                  <>⚠️ You've exceeded your carbs target - consider balancing your intake.</>
                )}
              </div>

              {carbsIntake < carbsTarget && (
                <p className="text-info mb-3">
                  You need {carbsTarget - carbsIntake}g more carbs to reach your goal.
                </p>
              )}

              {/* Carbs Goal Input */}
              <div className="mb-3">
                <label className="form-label">Set Daily Carbs Goal (g)</label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter Carbs Goal"
                    value={carbsTargetInput}
                    onChange={(e) => setCarbsTargetInput(Number(e.target.value))}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      if (carbsTargetInput > 0) {
                        setCarbsTarget(carbsTargetInput);
                        alert(`Carbs goal set to ${carbsTargetInput}g!`);
                      } else {
                        alert("Please enter a valid target amount.");
                      }
                    }}
                  >
                    Set Goal
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Water Intake Tracker */}
          <div className="col-md-6">
            <div className="card">
              <h3>💧 Water Intake Tracker</h3>
              <div className="mb-3">
                <p>
                  Water Consumed: <strong>{waterIntake} ml</strong> / Target: <strong>{waterTarget} ml</strong>
                </p>
                <div className="progress mb-2">
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{
                      width: `${Math.min((waterIntake / waterTarget) * 100, 100)}%`,
                      backgroundColor: 'var(--highlight-color)'
                    }}
                    aria-valuenow={waterIntake}
                    aria-valuemin="0"
                    aria-valuemax={waterTarget}
                  />
                </div>
                
                {/* Hydration Messages */}
                <div className="alert alert-info mb-2">
                  {waterIntake < waterTarget * 0.25 && (
                    <>🚰 Just getting started! Keep drinking to stay hydrated!</>
                  )}
                  {waterIntake >= waterTarget * 0.25 && waterIntake < waterTarget * 0.5 && (
                    <>🚰 You're making progress! Keep drinking to stay hydrated!</>
                  )}
                  {waterIntake >= waterTarget * 0.5 && waterIntake < waterTarget * 0.75 && (
                    <>💦 Halfway there! Keep up the good work!</>
                  )}
                  {waterIntake >= waterTarget * 0.75 && waterIntake < waterTarget && (
                    <>💦 Almost there! Just a bit more to reach your goal!</>
                  )}
                  {waterIntake >= waterTarget && (
                    <>🎉 Fantastic! You've reached your hydration goal!</>
                  )}
                </div>
                
                {waterIntake < waterTarget && (
                  <p className="text-info mb-0">
                    You need {waterTarget - waterIntake}ml more to reach your goal.
                  </p>
                )}
              </div>
              {/* Water Target Setting */}
              <div className="mb-3">
                <label className="form-label">Set Daily Water Target (ml)</label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    value={waterTargetInput}
                    onChange={(e) => setWaterTargetInput(Number(e.target.value))}
                    placeholder="Enter target in ml"
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      if (waterTargetInput > 0) {
                        setWaterTarget(waterTargetInput);
                      } else {
                        alert("Please enter a valid target amount.");
                      }
                    }}
                  >
                    Set Target
                  </button>
                </div>
              </div>
              {/* Water Intake Input */}
              <div className="mb-3">
                <label className="form-label">Add Water Intake</label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    value={waterInput}
                    onChange={(e) => setWaterInput(Number(e.target.value))}
                    placeholder="Enter water in ml"
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      if (waterInput > 0) {
                        setWaterIntake(waterIntake + waterInput);
                        setWaterInput(0);
                      } else {
                        alert("Please enter a valid amount.");
                      }
                    }}
                  >
                    Add Water
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress & Activity Graphs */}
        <div className="card mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>📈 Nutrition Progress Overview</h3>
            <div className="btn-group">
              <button
                className={`btn ${timePeriod === "day" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setTimePeriod("day")}
              >
                Today
              </button>
              <button
                className={`btn ${timePeriod === "week" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setTimePeriod("week")}
              >
                This Week
              </button>
              <button
                className={`btn ${timePeriod === "month" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setTimePeriod("month")}
              >
                This Month
              </button>
              <button
                className={`btn ${timePeriod === "year" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setTimePeriod("year")}
              >
                This Year
              </button>
            </div>
          </div>
          <div className="chart-container" style={{ height: "400px" }}>
            <Line data={progressData} options={options} />
          </div>
        </div>

        {/* Meal Logging Summary */}
        <div className="card mt-4">
          <h3>🍽️ Meal Logging Summary</h3>
          <div className="row">
            {["Breakfast", "Lunch", "Dinner", "Snacks"].map((mealType) => (
              <div key={mealType} className="col-md-6 mb-3">
                <h4>{mealType}</h4>
                <ul>
                  {mealLogs[mealType].map((meal, index) => (
                    <li key={index}>
                      {meal.name} - {meal.calories} kcal | {meal.protein}g protein | {meal.carbs}g carbs
                    </li>
                  ))}
                </ul>
                <p>
                  <strong>
                    Total: {" "}
                    {mealLogs[mealType].reduce(
                      (sum, meal) => sum + meal.calories,
                      0
                    )}{" "}
                    kcal |{" "}
                    {mealLogs[mealType].reduce(
                      (sum, meal) => sum + meal.protein,
                      0
                    )}g protein |{" "}
                    {mealLogs[mealType].reduce(
                      (sum, meal) => sum + meal.carbs,
                      0
                    )}g carbs
                  </strong>
                </p>

                {/* Input for Adding Meal */}
                <div className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Enter ${mealType} name`}
                    value={mealInput[mealType].name}
                    onChange={(e) =>
                      setMealInput({
                        ...mealInput,
                        [mealType]: {
                          ...mealInput[mealType],
                          name: e.target.value,
                        },
                      })
                    }
                  />
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter calories"
                    value={mealInput[mealType].calories}
                    onChange={(e) =>
                      setMealInput({
                        ...mealInput,
                        [mealType]: {
                          ...mealInput[mealType],
                          calories: Number(e.target.value),
                        },
                      })
                    }
                  />
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter protein (g)"
                    value={mealInput[mealType].protein}
                    onChange={(e) =>
                      setMealInput({
                        ...mealInput,
                        [mealType]: {
                          ...mealInput[mealType],
                          protein: Number(e.target.value),
                        },
                      })
                    }
                  />
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter carbs (g)"
                    value={mealInput[mealType].carbs}
                    onChange={(e) =>
                      setMealInput({
                        ...mealInput,
                        [mealType]: {
                          ...mealInput[mealType],
                          carbs: Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => addMeal(mealType)}
                >
                  Add {mealType}
                </button>
              </div>
            ))}
          </div>
        </div>

        
      </div>
    </>
  );
};

export default Welcome;
