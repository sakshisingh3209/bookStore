// Order.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the Order
const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    book: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    issuedAt: {
        type: Date,
        default: Date.now
    },
    // Add more fields as needed
});

// Create and export the model based on the schema
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;