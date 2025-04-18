💳 Banking Management System (MERN Stack)
A full-stack role-based banking web application built using React, Node.js, Express, and MongoDB, designed to manage customer accounts, transactions, support, loans, and administrative features.

🔍 Features
🔐 Authentication & Authorization
JWT-based secure login for Admin, Employee, and Customer roles
Role-based route protection

🧑‍💼 Admin Panel
Add / manage employees
View system reports
View and manage user accounts & roles
Monitor loan applications

🏦 Employee Panel
Verify transactions
Manage customer accounts
Resolve support tickets
Approve or reject loan requests

👤 Customer Panel
Account overview
Transfer funds to other users
Apply for loans
Raise support tickets

🛠️ Tech Stack
Frontend: React, Tailwind CSS, React Router
Backend: Node.js, Express
Database: MongoDB & Mongoose
Authentication: JWT
State Management: Context API

🚀 Getting Started
Prerequisites
Node.js

MongoDB

Installation
bash
Copy
Edit
# Clone the repo
git clone https://github.com/Guruprasad1002/Banking-Application.git
cd banking-app

# Install dependencies
cd Backend
npm install
cd ../Frontend
npm install

Environment Variables
Create a .env file in the Backend/ directory:
env
Copy
Edit
PORT=5000
DB_URL=mongodb://127.0.0.1:27017/banking_app
JWT_SECRET=yourSuperSecretKey
Run the Application

bash
Copy
Edit
# Backend
cd Backend
npm start

# Frontend
cd ../Frontend
npm run dev

📂 Folder Structure
css
Copy
Edit
Banking Project
├── Frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── authContext.js
│   │   └── ...
├── Backend/
│   ├── Models/
│   ├── Controllers/
│   ├── Routes/
│   ├── Middleware/
│   └── server.js


📌 License
This project is licensed under the MIT License.

