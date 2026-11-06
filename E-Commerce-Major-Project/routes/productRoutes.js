
const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Product = require("../models/Product");

// AUTHENTICATION AND ADMIN MIDDLEWARE
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");


// 1. ADD PRODUCT (ADMIN ONLY)
router.post("/add", auth, admin, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            image,
            stock
        } = req.body;

        if (
            !name ||
            !description ||
            price === undefined ||
            !category ||
            stock === undefined
        ) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        const newProduct = new Product({
            name,
            description,
            price,
            category,
            image,
            stock
        });

        await newProduct.save();

        res.status(201).json({
            message: "Product added successfully!",
            product: newProduct
        });

    } catch (error) {
        res.status(500).json({
            message: "Product adding failed",
            error: error.message
        });
    }
});


// 2. VIEW ALL PRODUCTS (PUBLIC)
router.get("/all", async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json({
            message: "Products fetched successfully!",
            products: products
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message
        });
    }
});


// 3. GET SINGLE PRODUCT BY ID (PUBLIC)
router.get("/:id", async (req, res) => {
    try {
        const productId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product fetched successfully!",
            product: product
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch product",
            error: error.message
        });
    }
});


// 4. UPDATE PRODUCT (ADMIN ONLY)
router.put("/update/:id", auth, admin, async (req, res) => {
    try {
        const productId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            req.body,
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product updated successfully!",
            product: updatedProduct
        });

    } catch (error) {
        res.status(500).json({
            message: "Product update failed",
            error: error.message
        });
    }
});


// 5. DELETE PRODUCT (ADMIN ONLY)
router.delete("/delete/:id", auth, admin, async (req, res) => {
    try {
        const productId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully!",
            product: deletedProduct
        });

    } catch (error) {
        res.status(500).json({
            message: "Product deletion failed",
            error: error.message
        });
    }
});


module.exports = router;
