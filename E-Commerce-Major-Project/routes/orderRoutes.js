
const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const auth = require("../middleware/auth");

// PLACE ORDER
router.post("/place", auth, async (req, res) => {
    try {
        const { address, phone } = req.body;

        if (!address || !phone) {
            return res.status(400).json({
                message: "Address and phone are required"
            });
        }

        const cart = await Cart.findOne({
            user: req.user.id
        }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                message: "Your cart is empty"
            });
        }

        let totalAmount = 0;
        const orderItems = [];

        // CHECK PRODUCTS AND STOCK
        for (const item of cart.items) {
            const product = item.product;

            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: "Insufficient product stock"
                });
            }

            totalAmount += product.price * item.quantity;

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            });
        }

        // CREATE ORDER
        const order = new Order({
            user: req.user.id,
            items: orderItems,
            totalAmount: totalAmount,
            address: address,
            phone: phone,
            paymentMethod: "COD",
            paymentStatus: "Pending",
            orderStatus: "Placed"
        });

        await order.save();

        // REDUCE PRODUCT STOCK
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(
                item.product._id,
                {
                    $inc: {
                        stock: -item.quantity
                    }
                }
            );
        }

        // CLEAR SHOPPING CART
        cart.items = [];
        await cart.save();

        return res.status(201).json({
            message: "Order placed successfully!",
            order: order
        });

    } catch (error) {
        console.error("Order Error:", error);

        return res.status(500).json({
            message: "Failed to place order",
            error: error.message
        });
    }
});


// VIEW MY ORDERS
router.get("/my-orders", auth, async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user.id
        })
        .populate("user", "name email")
        .populate("items.product");

        return res.status(200).json({
            message: "Orders fetched successfully!",
            orders: orders
        });

    } catch (error) {
        console.error("Get Orders Error:", error);

        return res.status(500).json({
            message: "Failed to fetch orders",
            error: error.message
        });
    }
});

module.exports = router;
