const Order = require('../models/order');
const Book = require('../models/book');
const User = require('../models/user');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const { sendEmailNotifications } = require('../controllers/notificationController');


//create a new order

const createOrder = async(req, res) => {
    try {
        const { userId, bookId, quantity } = req.body;
        const user = await User.findById(userId);
        const book = await Book.findById(bookId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        //create a new order
        const newOrder = new Order({
            user: userId,
            book: bookId,
            quantity
        });
        await newOrder.save();
        book.stock -= quantity;
        await book.save();

        res.status(201).json({ message: 'Order created successfully', order: newOrder });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


//get all orders

const getAllOrders = async(req, res) => {
    try {
        const orders = await Order.find().populate('user').populate('book');
        res.json(orders);

    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



//get orders by user

const getOrdersByUser = async(req, res) => {
    try {
        const userId = req.params.userId;
        const orders = await Order.find({ user: userId }).populate('book');
        res.json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Update an order (example: mark order as returned)
const updateOrder = async(req, res) => {
    try {
        const orderId = req.params.orderId;
        const updatedFields = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(orderId, updatedFields, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ message: 'Order updated successfully', order: updatedOrder });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete an order
const deleteOrder = async(req, res) => {
    try {
        const orderId = req.params.orderId;

        const deletedOrder = await Order.findByIdAndDelete(orderId);

        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Optionally: Update book stock if needed

        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
const processPayment = async(req, res) => {
    try {
        const { amount, currency, source, description } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method_types: ['card'],
            description,
            payment_method: source,
            confirm: true,
        });

        // Handle successful payment

        res.json({ message: 'Payment processed successfully', paymentIntent });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ message: 'Payment processing failed' });
    }
};


// Confirm an order and send notification
const confirmOrder = async(req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId).populate('user');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }


        // Send notification to user via email
        await sendEmailNotifications(
            order.user.email,
            'Order Confirmed',
            `Your order with ID ${order._id} has been confirmed.`
        );

        res.json({ message: 'Order confirmed successfully' });
    } catch (error) {
        console.error('Error confirming order:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



module.exports = {
    createOrder,
    getAllOrders,
    updateOrder,
    deleteOrder,
    getOrdersByUser,
    confirmOrder,
    processPayment
}