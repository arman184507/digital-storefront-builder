# 🛍️ Digital Storefront Builder

A full-stack web application that allows small businesses to create, customize, publish, and manage their own online stores.

Owners can manage products, customers, orders, and store analytics, while customers can browse products, add items to their cart, and place orders.

---

## 🌐 Live Demo

🚀 **Coming Soon**

<!-- Add your deployed project link here later -->

---

## ✨ Features

### 👤 Authentication
- Owner registration and login
- JWT-based authentication
- Protected owner routes
- Secure logout and authentication handling

### 🏪 Store Management
- Create multiple online stores
- Customize store name and tagline
- Select store templates and themes
- Edit store information
- Publish and view stores
- Delete stores

### 📦 Product Management
- Add products
- Edit products
- Delete products
- Product categories
- Stock management
- Product descriptions
- Product image URLs
- Product search and category filtering

### 🛒 Customer Shopping
- Public storefront
- Browse products
- Product images
- Add products to cart
- Increase and decrease quantities
- Remove products from cart
- Store-specific shopping cart

### 💳 Checkout & Orders
- Customer checkout
- Customer information
- COD, UPI and Card payment options
- Mock payment flow
- Order creation
- Order success page
- Order status management

### 👥 Customer Management
- View customers
- Customer contact information
- Number of orders
- Total amount spent
- Customer search

### 📊 Dashboard & Analytics
- Total orders
- Total revenue
- Total products
- Total customers
- Recent orders
- Sales analytics
- Products sold

---

## 🛠️ Built With

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- React Router
- Axios
- Context API
- Vite

### Backend
- Node.js
- Express.js
- REST APIs
- JWT Authentication

### Database
- MySQL

---

## 🏗️ Project Architecture

Customer / Store Owner
        ↓
React Frontend
        ↓
Axios
        ↓
Node.js + Express
        ↓
MySQL

---

## 📁 Project Structure

digital-storefront-builder/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md

---

## 🚀 Getting Started

### 1. Clone the repository

git clone https://github.com/arman184507/digital-storefront-builder.git

### 2. Open the project

cd digital-storefront-builder

---

## ⚙️ Backend Setup

Go to the backend folder:

cd backend

Install dependencies:

npm install

Configure your local MySQL database connection in the environment configuration.

Then start the backend:

npm run dev

The backend runs on:

http://localhost:5000

---

## 💻 Frontend Setup

Open another terminal and go to the frontend folder:

cd frontend

Install dependencies:

npm install

Start the frontend:

npm run dev

The frontend will normally run on:

http://localhost:5173

---

## 🔐 Authentication

The application uses JWT-based authentication to protect owner-only functionality.

Protected areas include:

- Dashboard
- My Stores
- Products
- Orders
- Customers
- Analytics
- Settings

Customers can access published storefronts without accessing owner management pages.

---

## 🔄 Main Application Flow

Owner Registration
        ↓
Owner Login
        ↓
Dashboard
        ↓
Create Store
        ↓
Choose Template
        ↓
Customize Store
        ↓
Add Products
        ↓
Publish Store
        ↓
Customer Visits Store
        ↓
Browse Products
        ↓
Add to Cart
        ↓
Checkout
        ↓
Place Order
        ↓
Order Success
        ↓
Owner Manages Order
        ↓
Dashboard & Analytics

---

## 🎯 Project Purpose

The goal of this project is to provide small businesses with a simple way to create and manage an online storefront without needing to build an e-commerce website from scratch.

---

## 👨‍💻 Author

Arman Shaikh

GitHub:
https://github.com/arman184507

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
