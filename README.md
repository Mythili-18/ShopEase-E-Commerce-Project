# 🛍️ ShopEase – E-Commerce Website

## 📌 Project Overview

ShopEase is a full-stack E-Commerce web application developed using HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB.

The application allows customers to register, log in, browse products, add products to their shopping cart, place orders, and track their order status.

It also provides an Admin Panel to manage products, customers, orders, and payment statuses.

## 🎯 Project Objectives

- Develop a user-friendly online shopping platform.
- Provide secure customer registration and login.
- Manage products and shopping cart operations.
- Enable customers to place Cash on Delivery (COD) orders.
- Allow administrators to manage products, customers, and orders.

## 🚀 Technologies Used

**Frontend**
- HTML5
- CSS3
- JavaScript
- Bootstrap

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB Atlas
- Mongoose

**Authentication**
- JSON Web Token (JWT)
- bcryptjs

**Development Tools**
- Visual Studio Code
- Git and GitHub
- Thunder Client

## ✨ Main Features

### 👤 Customer Module
- Customer Registration
- Customer Login
- View Available Products
- View Product Details
- Add Products to Cart
- Update Cart Quantity
- Remove Products from Cart
- Checkout
- Cash on Delivery (COD)
- Place Orders
- View Order History
- Track Order Status

### 🔐 Admin Module
- Admin Login
- Admin Dashboard
- View Dashboard Statistics
- Add New Products
- Update Products
- Delete Products
- View Customer Details
- View All Orders
- Update Order Status
- Update Payment Status

## 📂 Project Structure

```text
E-Commerce-Major-Project/
│
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   └── Order.js
│
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   ├── orderRoutes.js
│   └── adminRoutes.js
│
├── middleware/
│   ├── auth.js
│   └── admin.js
│
├── public/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── product.html
│   ├── cart.html
│   ├── checkout.html
│   ├── myorders.html
│   ├── admin.html
│   ├── admin-products.html
│   ├── addproduct.html
│   ├── customers.html
│   ├── orders.html
│   │
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       ├── auth.js
│       ├── register.js
│       ├── products.js
│       ├── product.js
│       ├── cart.js
│       ├── checkout.js
│       ├── orders.js
│       ├── admin.js
│       ├── admin-products.js
│       └── customers.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

## ⚙️ Installation and Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/Mythili-18/ShopEase-E-Commerce-Project.git
```

### Step 2: Open the Project Folder

```bash
cd ShopEase-E-Commerce-Project
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Configure Environment Variables

Create a `.env` file in the project root directory.

Add your own MongoDB Atlas connection string and JWT secret:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Do not share or upload your `.env` file.

### Step 5: Start the Application

```bash
npm run dev
```

### Step 6: Open in Browser

```text
http://localhost:3000
```

## 🛒 Order and Payment

ShopEase currently supports Cash on Delivery (COD).

Customers can place orders after providing their delivery address and phone number.

Administrators can update order statuses:

- Placed
- Processing
- Shipped
- Delivered
- Cancelled

Payment statuses:

- Pending
- Paid
- Failed

## 🔒 Security Features

- Password hashing using bcryptjs.
- JWT-based authentication.
- Protected customer and admin routes.
- Admin role-based authorization.
- Environment variables for sensitive configuration.

## 👩‍💻 Developed By

**Mythili S.**

B.Tech – Artificial Intelligence and Data Science

Sona College of Technology, Salem

## 🔗 GitHub Repository

https://github.com/Mythili-18/ShopEase-E-Commerce-Project

---

**ShopEase – Making Online Shopping Simple and Convenient!**
