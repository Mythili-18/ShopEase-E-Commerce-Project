
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    // CUSTOMER DETAILS
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // ORDERED PRODUCTS
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,
                required: true,
                min: 0
            }
        }
    ],

    // TOTAL ORDER AMOUNT
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },

    // DELIVERY DETAILS
    address: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    // PAYMENT METHOD
    paymentMethod: {
        type: String,
        enum: ["COD"],
        default: "COD"
    },

    // PAYMENT STATUS
    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending"
    },

    // ORDER STATUS
    orderStatus: {
        type: String,
        enum: [
            "Placed",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        ],
        default: "Placed"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);
