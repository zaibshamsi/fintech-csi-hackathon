# FinTrack AI: Smart Expense Tracker (Backend Submission)

## 🚀 Introduction
FinTrack AI is the server-side engine for a modern personal finance application, built to tackle the challenge of managing expenses and enhancing financial security. This project was developed for the CSI Hackathon.

As per the problem statement, a UI/UX was to be developed "if applicable." Given my recent internship experience focused on the Node.js domain, I chose to dedicate my efforts to building a robust, feature-rich, and scalable backend. This submission showcases a deep understanding of server-side architecture, API design, database management, and integration with third-party AI services.

The core of this project is a secure RESTful API built with Node.js, Express, and MongoDB, designed to be the single source of truth for any frontend application.

## ✨ Core Features
This backend is more than just a simple CRUD API. It incorporates features designed for a real-world fintech product:

### Secure Authentication: 
End-to-end user authentication using JSON Web Tokens (JWT). User passwords are fully encrypted using bcryptjs.

### Complete Transaction Management:
Full support for creating, reading, and listing user-specific transactions (income and expenses).

### Atomic Peer-to-Peer Transfers:
Securely transfer funds between users. The entire process is wrapped in a MongoDB atomic transaction, ensuring that a transfer either completes fully (updating balances for both sender and receiver) or fails safely, preventing any data corruption.

###⭐ AI-Powered Expense Categorization:
The standout feature. If a user adds an expense without specifying a category, the backend automatically sends the transaction's description to the Google Gemini API. The AI analyzes the text (e.g., "Uber ride to airport") and returns a clean, relevant category (e.g., "Transport"), which is then saved to the database. This significantly improves user experience by automating manual data entry.

### Customizable Fraud Alerts:
Users can define a custom spending limit via the API. The backend securely stores this value for the frontend to use in triggering alerts.

## 🛠️ Tech Stack
This project leverages a modern, efficient, and scalable technology stack:

Runtime: Node.js

Framework: Express.js

Database: MongoDB with Mongoose ODM

Authentication: JSON Web Tokens (JWT) & bcrypt.js

AI Service: Google Gemini API (gemini-2.5-flash-preview-05-20) via Axios

## 📋 API Endpoints

The API is structured logically around authentication, users, and transactions. All protected routes require a Bearer <token> in the Authorization header.

| Endpoint                 | Method | Protection | Description                                                                 |
|---------------------------|--------|------------|-----------------------------------------------------------------------------|
| `/api/auth/register`      | POST   | Public     | Registers a new user.                                                       |
| `/api/auth/login`         | POST   | Public     | Logs in a user and returns a JWT.                                           |
| `/api/auth/me`            | GET    | Private    | Fetches the profile of the logged-in user.                                  |
| `/api/user/settings`     | PUT    | Private    | Updates the user's fraud alert limit.                                       |
| `/api/transactions`       | GET    | Private    | Fetches all transactions for the logged-in user.                            |
| `/api/transactions`       | POST   | Private    | Adds a transaction. Triggers AI if category is omitted for an expense.      |
| `/api/transactions/transfer` | POST | Private   | Transfers funds to another user.                                            |

## ⚙️ Local Setup & Installation
To get this server running on your local machine, follow these steps:

Clone the Repository

`git clone "link of the repo"
cd csihackathon-fintechProject/server`

Install Dependencies

``npm install``

Create Environment File

`These is my dot env file just for the csi submission and fast checking for the evaluator`

#### MONGO_URI = mongodb+srv://zaibsmart786_db_user:qwerty786$@cluster1.wxsfdgl.mongodb.net/
#### PORT = 5000
#### JWT_SECRET = a_secret_code 
#### GOOGLE _ GEMINI _ API_ KEY = AIzaSyC40E5I9M-VG4Y7ATER8swbwzSXUUORPio

nodemon run dev

The API will now be running on http://localhost:5000. You can test the endpoints using a tool like Postman.

## Here is the link to complete documentation of all endpoints on postman

https://pdflovers.postman.co/workspace/preply~a1ae11b2-82c0-4c17-9232-2382b4638d3c/collection/41837948-787d27db-3072-4507-b684-f39f06bbf0df?action=share&creator=41837948
