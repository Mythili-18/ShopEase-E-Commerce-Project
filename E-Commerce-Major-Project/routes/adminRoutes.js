
const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// ADMIN DASHBOARD
router.get("/dashboard", auth, admin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({
            role: "user"
        });

        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();

        res.status(200).json({
            message: "Admin dashboard data fetched successfully!",
            totalUsers,
            totalProducts,
            totalOrders
        });

    } catch (error) {
        res.status(500).json({
            message: "Dashboard error",
            error: error.message
        });
    }
});


// VIEW ALL CUSTOMERS
router.get("/customers", auth, admin, async (req, res) => {
    try {
        const customers = await User.find({
            role: "user"
        }).select("-password");

        res.status(200).json({
            message: "Customers fetched successfully!",
            customers
        });

    } catch (error) {
        res.status(500).json({
            message: "Customer fetching error",
            error: error.message
        });
    }
});


// VIEW ALL ORDERS
router.get("/orders", auth, admin, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email phone")
            .populate("items.product");

        res.status(200).json({
            message: "All orders fetched successfully!",
            orders
        });

    } catch (error) {
        res.status(500).json({
            message: "Order fetching error",
            error: error.message
        });
    }
});


// UPDATE ORDER STATUS
router.put("/orders/:id/status", auth, admin, async (req, res) => {
    try {
        const { orderStatus } = req.body;

        const allowedStatuses = [
            "Placed",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        ];

        if (!allowedStatuses.includes(orderStatus)) {
            return res.status(400).json({
                message: "Invalid order status"
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                orderStatus: orderStatus
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json({
            message: "Order status updated successfully!",
            order
        });

    } catch (error) {
        console.error("Update Order Status Error:", error);

        res.status(500).json({
            message: "Failed to update order status",
            error: error.message
        });
    }
});


// UPDATE PAYMENT STATUS
router.put("/orders/:id/payment-status", auth, admin, async (req, res) => {
    try {
        const { paymentStatus } = req.body;

        const allowedStatuses = [
            "Pending",
            "Paid",
            "Failed"
        ];

        if (!allowedStatuses.includes(paymentStatus)) {
            return res.status(400).json({
                message: "Invalid payment status"
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                paymentStatus: paymentStatus
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json({
            message: "Payment status updated successfully!",
            order
        });

    } catch (error) {
        console.error("Update Payment Status Error:", error);

        res.status(500).json({
            message: "Failed to update payment status",
            error: error.message
        });
    }
});


module.exports = router;
