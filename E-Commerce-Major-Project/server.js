
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SERVE HTML, CSS AND JAVASCRIPT FILES
app.use(express.static(path.join(__dirname, "public")));

// API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// HOME PAGE
app.get("/", (req, res) => {
    res.send("<h1>E-Commerce Website Server Running Successfully!</h1>");
});

// DATABASE CONNECTION
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully!");

        app.listen(3000, () => {
            console.log("Server running at http://localhost:3000");
        });
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error.message);
    });
