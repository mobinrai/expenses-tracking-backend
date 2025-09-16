📊 Expenses Tracking Backend

A backend service for tracking expenses, built with Node.js, Express, and MongoDB.

🚀 Features

User authentication with JWT

Secure password hashing with bcrypt

RESTful API using Express

MongoDB database integration with Mongoose

CORS enabled for cross-origin requests

📦 Tech Stack

Node.js
 (v18+ recommended)

Express

MongoDB
 + Mongoose

bcrypt
 for password hashing

jsonwebtoken
 for authentication


 ⚙️ Installation

Clone the repository:

git clone https://github.com/your-username/expenses-tracking-backend.git
cd expenses-tracking-backend


Install dependencies:

npm install


Create a .env file in the root directory:

PORT=5000
MONGO_URI=mongodb://localhost:27017/expenses
JWT_SECRET=your_jwt_secret


▶️ Running the Server

Start the server in watch mode:

npm start


By default, it will run on:
👉 http://localhost:5000
