
const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const auth = require("../middleware/auth");


// 1. ADD PRODUCT TO CART
router.post("/add", auth, async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Valid product ID is required"
            });
        }

        const qty = quantity === undefined ? 1 : Number(quantity);

        if (!Number.isInteger(qty) || qty < 1) {
            return res.status(400).json({
                message: "Quantity must be a positive whole number"
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = new Cart({
                user: req.user.id,
                items: []
            });
        }

        const existingItem = cart.items.find(
            item => item.product.toString() === productId
        );

        const newQuantity = existingItem
            ? existingItem.quantity + qty
            : qty;

        if (newQuantity > product.stock) {
            return res.status(400).json({
                message: "Not enough stock available"
            });
        }

        if (existingItem) {
            existingItem.quantity = newQuantity;
        } else {
            cart.items.push({
                product: productId,
                quantity: qty
            });
        }

        await cart.save();

        res.status(200).json({
            message: "Product added to cart successfully!",
            cart: cart
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add product to cart",
            error: error.message
        });
    }
});

// VIEW CART
router.get("/view", auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({
            user: req.user.id
        }).populate("items.product");

        if (!cart) {
            return res.status(200).json({
                message: "Your cart is empty",
                items: []
            });
        }

        res.status(200).json({
            message: "Cart fetched successfully!",
            cart: cart
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to view cart",
            error: error.message
        });
    }
});

// REMOVE PRODUCT FROM CART
router.delete("/remove/:productId", auth, async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const cart = await Cart.findOne({
            user: req.user.id
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        cart.items = cart.items.filter(
            item => item.product.toString() !== productId
        );

        await cart.save();

        res.status(200).json({
            message: "Product removed from cart successfully!",
            cart
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to remove product",
            error: error.message
        });
    }
});

// UPDATE CART QUANTITY
router.put("/update/:productId", auth, async (req, res) => {
    try {
        const { productId } = req.params;
        const quantity = Number(req.body.quantity);

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be at least 1"
            });
        }

        const cart = await Cart.findOne({
            user: req.user.id
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const item = cart.items.find(
            item => item.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({
                message: "Product not found in cart"
            });
        }

        const product = await Product.findById(productId);

        if (!product || quantity > product.stock) {
            return res.status(400).json({
                message: "Requested quantity is not available"
            });
        }

        item.quantity = quantity;
        await cart.save();

        res.status(200).json({
            message: "Cart quantity updated successfully!",
            cart
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update cart",
            error: error.message
        });
    }
});

module.exports = router;
