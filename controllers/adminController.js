const Book = require('../models/book');

// Increase stock of a book
const increaseStock = async(req, res) => {
    try {
        const { quantity } = req.body;
        const bookId = req.params.id;

        const book = await Book.findByIdAndUpdate(bookId, { $inc: { stock: quantity } }, { new: true });

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.json({ message: 'Stock updated successfully', book });
    } catch (error) {
        console.error('Error increasing stock:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Decrease stock of a book
const decreaseStock = async(req, res) => {
    try {
        const { quantity } = req.body;
        const bookId = req.params.id;

        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        book.stock -= quantity;
        await book.save();

        res.json({ message: 'Stock updated successfully', book });
    } catch (error) {
        console.error('Error decreasing stock:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { increaseStock, decreaseStock };