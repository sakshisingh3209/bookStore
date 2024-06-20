// Book.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the Book
const bookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        String
    },
    genre: [String], // Array of genres
    ISBN: {
        type: String,
        unique: true,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    publishedDate: Date,
    publisher: String,
    issuedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User' // Reference to the User who issued the book
    },
    orders: [{
        type: Schema.Types.ObjectId,
        ref: 'Order' // References to the orders related to the book
    }],
    stock: {
        type: Number,
        default: 0
    },

});

// Create and export the model based on the schema
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;