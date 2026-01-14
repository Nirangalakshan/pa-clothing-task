# PA Clothing - E-Commerce Platform

A full-stack e-commerce application for clothing retail built with React, Node.js, Express, and MongoDB.

## 🚀 Repository

**GitHub Repository:** [pa-clothing](https://github.com/nirangalakshan/pa-clothing)

> **Note:** Replace the above link with your actual GitHub repository URL once you push the code.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project Locally](#running-the-project-locally)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- User authentication (Register/Login with JWT)
- Product browsing and search
- Shopping cart management
- Order processing
- Email notifications for orders
- Responsive design with Tailwind CSS
- RESTful API architecture

## 🛠️ Tech Stack

### Frontend

- **React** 19.2.0 - UI library
- **Vite** 7.2.4 - Build tool and dev server
- **React Router DOM** 7.12.0 - Client-side routing
- **Tailwind CSS** 4.1.18 - Utility-first CSS framework
- **Axios** 1.13.2 - HTTP client
- **React Hot Toast** 2.6.0 - Toast notifications
- **React Icons** 5.5.0 - Icon library

### Backend

- **Node.js** - Runtime environment
- **Express** 4.18.2 - Web framework
- **MongoDB** with **Mongoose** 8.0.3 - Database
- **JWT** (jsonwebtoken 9.0.2) - Authentication
- **bcryptjs** 2.4.3 - Password hashing
- **Nodemailer** 6.10.1 - Email service
- **CORS** 2.8.5 - Cross-origin resource sharing
- **dotenv** 16.3.1 - Environment variables

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB Atlas Account** (or local MongoDB installation)
- **Gmail Account** (for email notifications)

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone [REPOSITORY_URL]
cd pa-clothing
```

### 2. Install Root Dependencies

```bash
npm install
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### 4. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory with the following configuration:

```env
# Database Configuration
MONGO_URI=your_mongodb_connection_string

# Server Configuration
PORT=5000

# JWT Secret (use a strong, random string in production)
JWT_SECRET=your_jwt_secret_key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
```

### 📝 Configuration Notes

#### 1. MongoDB Setup

**Option A: MongoDB Atlas (Recommended)**

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `pa-clothing`
7. Paste the complete string in `MONGO_URI`

Example:

```
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/pa-clothing?retryWrites=true&w=majority
```

**Option B: Local MongoDB**

```
MONGO_URI=mongodb://localhost:27017/pa-clothing
```

#### 2. JWT Secret

Generate a secure random string for JWT_SECRET:

```bash
# On Windows PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})

# Or use any random string generator
```

#### 3. Email Configuration (Gmail)

To send order confirmation emails, you need a Gmail App Password:

1. Go to your [Google Account](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. Scroll down to **App passwords**
4. Select **Mail** and **Windows Computer** (or Other)
5. Click **Generate**
6. Copy the 16-character password (without spaces)
7. Use this as `EMAIL_PASS` in your `.env` file

**Important:** Never use your actual Gmail password. Always use an App Password.

#### 4. Security Recommendations

⚠️ **NEVER commit the `.env` file to version control!**

The `.gitignore` file is already configured to exclude:

- `backend/.env`
- `node_modules/`

Before deploying to production:

- Use strong, unique values for `JWT_SECRET`
- Use environment-specific URLs for `FRONTEND_URL`
- Consider using a dedicated email service (SendGrid, AWS SES, etc.)
- Enable MongoDB IP whitelisting
- Use HTTPS in production

## 🚀 Running the Project Locally

### Option 1: Run Both Servers Separately (Recommended for Development)

**Terminal 1 - Backend Server:**

```bash
cd backend
node server.js
```

The backend will run on `http://localhost:5000`

**Terminal 2 - Frontend Dev Server:**

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

### Option 2: Run with Watch Mode (Auto-restart on changes)

**Backend with auto-reload:**

```bash
cd backend
npm run dev
```

**Frontend (already has hot-reload):**

```bash
cd frontend
npm run dev
```

### Verify Installation

1. **Backend Health Check:**

   - Open `http://localhost:5000/api/health`
   - You should see: `{"status":"ok","message":"PA Clothing API is running"}`

2. **Frontend:**
   - Open `http://localhost:5173`
   - You should see the PA Clothing homepage

## 📁 Project Structure

```
pa-clothing/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── data/
│   │   └── seed.js            # Database seeding script
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Product.js         # Product schema
│   │   ├── Cart.js            # Cart schema
│   │   └── Order.js           # Order schema
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── products.js        # Product routes
│   │   ├── cart.js            # Cart routes
│   │   └── orders.js          # Order routes
│   ├── utils/
│   │   └── email.js           # Email utility functions
│   ├── .env                   # Environment variables (DO NOT COMMIT)
│   ├── .gitignore
│   ├── package.json
│   └── server.js              # Express server entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── context/           # React context (auth, cart, etc.)
│   │   ├── utils/             # Utility functions
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── .gitignore
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication

- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (protected)

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products/cloths` - Add products to datbase (I setup the products on MongoDB instead of using products array)

### Cart

- `GET /api/cart` - Get user's cart (protected)
- `POST /api/cart` - Add item to cart (protected)
- `PUT /api/cart/:id` - Update cart item (protected)
- `DELETE /api/cart/:id` - Remove cart item (protected)

### Orders

- `POST /api/orders` - Create new order (protected)
- `GET /api/orders` - Get user's orders (protected)
- `GET /api/orders/:id` - Get single order (protected)

## 🌍 Environment Variables

### Backend (.env)

| Variable       | Description               | Example                                                   |
| -------------- | ------------------------- | --------------------------------------------------------- |
| `MONGO_URI`    | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/pa-clothing` |
| `PORT`         | Backend server port       | `5000`                                                    |
| `JWT_SECRET`   | Secret key for JWT tokens | `your_secret_key_here`                                    |
| `FRONTEND_URL` | Frontend URL for CORS     | `http://localhost:5173`                                   |
| `EMAIL_HOST`   | SMTP host                 | `smtp.gmail.com`                                          |
| `EMAIL_PORT`   | SMTP port                 | `465`                                                     |
| `EMAIL_USER`   | Email address             | `your_email@gmail.com`                                    |
| `EMAIL_PASS`   | Email app password        | `your_app_password`                                       |

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error

```
Error: MongooseServerSelectionError
```

**Solution:**

- Verify your `MONGO_URI` is correct
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure your database user has proper permissions

#### 2. CORS Error

```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:**

- Verify `FRONTEND_URL` in backend `.env` matches your frontend URL
- Ensure both servers are running

#### 3. Email Not Sending

```
Error: Invalid login
```

**Solution:**

- Use Gmail App Password, not your regular password
- Enable 2-Step Verification in Google Account
- Verify `EMAIL_USER` and `EMAIL_PASS` are correct

#### 4. Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change PORT in .env
```

#### 5. Module Not Found

```
Error: Cannot find module
```

**Solution:**

```bash
# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

## 📧 Contact & Support

For issues, questions, or contributions, please:

1. Check the [Issues](https://github.com/nirangalakshan/pa-clothing/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 📄 License

This project is licensed under the ISC License.

---

**Happy Coding! 🎉**

Made with ❤️ by [Niranga Lakshan]
