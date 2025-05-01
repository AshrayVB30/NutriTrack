Here’s an updated version of your `README.md` with a new section **📦 Docker Setup**, clearly describing how to run the NutriTrack app using Docker and Docker Compose:

---

## NutriTrack

NutriTrack is a comprehensive nutrition tracking application designed to help users monitor their diet, track their calorie intake, and maintain a healthy lifestyle.

### 📁 Project Overview

NutriTrack aims to simplify nutrition management by allowing users to log their meals, set dietary goals, and analyze their nutrition intake. The application can be used by individuals seeking weight management, athletes optimizing their diet, or anyone interested in better understanding their nutritional habits.

---

### 🚀 Features

- Track daily meals and snacks  
- Log calories, proteins, fats, and carbohydrates  
- Set personalized dietary goals  
- View nutrition breakdown through charts and graphs  
- Analyze progress over time  

---

### 💻 Tech Stack

- **Frontend:** React.js, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Atlas)  
- **Authentication:** JWT  
- **API Integration:** Nutrition APIs for food data  

---

### 🔧 Installation & Setup (Local)

1. Clone the repository:
   ```bash
   git clone https://github.com/AshrayVB30/NutriTrack.git
   cd NutriTrack
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

---

### 📦 Docker Setup (Recommended)

NutriTrack supports containerization using **Docker** and **Docker Compose**.

#### 🐳 Prerequisites

- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)

#### 🏗️ Build & Run All Services

```bash
docker-compose up --build
```

#### 🌐 Access the App

- Frontend: [http://localhost:3000](http://localhost:3000)  
- Backend API: [http://localhost:5000](http://localhost:5000)

#### 🛑 Stop Services

```bash
docker-compose down
```

#### 🧾 Notes

- MongoDB Atlas is used as the cloud database. Update `MONGO_URI` in `backend/.env` accordingly.
- CORS is configured to support both Vite (`localhost:5173`) and Docker frontend (`localhost:3000`).

---

### 🛠️ Backend

The backend of NutriTrack is built with **Node.js** and **Express.js**, connected to a **MongoDB Atlas** database. It handles user authentication, meal logging, and interaction with the nutrition data API.

#### 🔒 Authentication

- **JWT-based authentication** is used to protect user routes.
- Users can register and log in with their credentials.

#### 📦 Backend Folder Structure

```
/backend
│
├── controllers        # Business logic (userController.js, etc.)
├── models             # Mongoose models (User.js, Meal.js, etc.)
├── routes             # API routes (userRouter.js, mealRouter.js)
├── middlewares        # Custom middleware (e.g., auth, cors)
├── .env               # Environment variables
├── index.js           # Entry point of the server
```

---

#### 📥 Installation & Running the Backend (Non-Docker)

```bash
cd backend
npm install
npm run dev
```

Or if using plain node:

```bash
node index.js
```

---

#### 🔐 .env File Format

Create a `.env` file in the `/backend` folder with the following:

```env
PORT=5000
MONGO_URI=mongodb+srv://<your_mongo_connection>
JWT_SECRET=your_jwt_secret
```

---

### 🤝 Contributions

Dumpa Revanth - [@Revanthdumpa43](https://github.com/Revanthdumpa43)  
Ashray V B - [@AshrayVB30](https://github.com/AshrayVB30)

---

### 📄 License

MIT License

---
