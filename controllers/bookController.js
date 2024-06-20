const Book = require('../models/book');
const User = require('../models/user');
const Order = require('../models/order');
const { sendEmailNotifications } = require('../controllers/notificationController');
const createBook = async(req, res) => {
    try {
        const { title, author, description, genre, ISBN, price, publishedDate, publisher } = req.body;

        const newBook = new Book({
            title,
            author,
            description,
            genre,
            ISBN,
            price,
            publishedDate,
            publisher
        });

        await newBook.save();
        const users = await User.find();

        // Send notifications to users via email
        const promises = users.map(user =>
            sendEmailNotifications(
                user.email,
                'New Book Release',
                `A new book titled "${title}" by ${author} has been released. Check it out!`
            )
        );

        await Promise.all(promises);

        res.status(201).json({ message: 'Book created successfully', book: newBook });
    } catch (error) {
        console.error('Error creating book:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
//get all books
const getAllBooks = async(req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


//get a single book by id

const getBookById = async(req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.json(book);
    } catch (error) {
        console.error('Error fetching book by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


//update book
const updateBook = async(req, res) => {
    try {
        const { title, author, description, genre, ISBN, price, publishedDate, publisher } = req.body;

        const updatedBook = await Book.findByIdAndUpdate(req.params.id, {
            title,
            author,
            description,
            genre,
            ISBN,
            price,
            publishedDate,
            publisher
        }, { new: true }); // { new: true } ensures updated document is returned

        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.json({ message: 'Book updated successfully', book: updatedBook });
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
//delete book
const deleteBook = async(req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);

        if (!deletedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.json({ message: 'Book deleted successfully', book: deletedBook });
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ message: 'Server error' });
    }
};




// Search books
const searchBooks = async(req, res) => {
    try {
        const { query } = req.query;

        // Example: search by title or author
        const books = await Book.find({
            $or: [
                { title: { $regex: query, $options: 'i' } }, // Case-insensitive search
                { author: { $regex: query, $options: 'i' } }
            ]
        });

        res.json(books);
    } catch (error) {
        console.error('Error searching books:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get paginated books
const getPaginatedBooks = async(req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const books = await Book.find()
            .skip(skip)
            .limit(limit);

        res.json(books);
    } catch (error) {
        console.error('Error fetching paginated books:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
// Filter books
const filterBooks = async(req, res) => {
    try {
        const { genre, minPrice, maxPrice } = req.query;

        let filter = {};

        if (genre) {
            filter.genre = genre;
        }

        if (minPrice && maxPrice) {
            filter.price = { $gte: minPrice, $lte: maxPrice };
        } else if (minPrice) {
            filter.price = { $gte: minPrice };
        } else if (maxPrice) {
            filter.price = { $lte: maxPrice };
        }

        const books = await Book.find(filter);

        res.json(books);
    } catch (error) {
        console.error('Error filtering books:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Sort books
const sortBooks = async(req, res) => {
    try {
        const { sortBy } = req.query;

        let sortOption = {};

        if (sortBy === 'title') {
            sortOption = { title: 1 }; // Sort by title ascending
        } else if (sortBy === 'author') {
            sortOption = { author: 1 }; // Sort by author ascending
        } else if (sortBy === 'price') {
            sortOption = { price: 1 }; // Sort by price ascending
        }

        const books = await Book.find().sort(sortOption);

        res.json(books);
    } catch (error) {
        console.error('Error sorting books:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

//Issue a book to a user
const issueBook = async(req, res) => {
    try {
        const { userId, bookId } = req.body;

        const user = await User.findById(userId);
        const book = await Book.findById(bookId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.stock === 0) {
            return res.status(400).json({ message: 'Book out of stock' });
        }
        // Create an order
        const newOrder = new Order({
            user: userId,
            book: bookId,
            quantity: 1 // Assuming issuing one book
        });

        await newOrder.save();

        // Update book stock
        book.stock -= 1;
        await book.save();

        res.json({ message: 'Book issued successfully', order: newOrder });
    } catch (error) {
        console.error('Error issuing book:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
// Return a book
const returnBook = async(req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const book = await Book.findById(order.book);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Increase book stock
        book.stock += 1;
        await book.save();

        // Delete the order (or mark it as returned based on your design)
        await Order.findByIdAndDelete(orderId);

        res.json({ message: 'Book returned successfully' });
    } catch (error) {
        console.error('Error returning book:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



module.exports = {
    createBook,
    getAllBooks,
    searchBooks,
    filterBooks,
    sortBooks,
    getPaginatedBooks,
    getBookById,
    updateBook,
    deleteBook,
    issueBook,
    returnBook,


};