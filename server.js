const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const EventEmitter = require('events');

// Increase max listeners limit
EventEmitter.defaultMaxListeners = 15;

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON bodies of incoming requests
app.use(express.json());


//routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const orderRoutes = require('./routes/orderRoutes');
//middleware
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes);
// Define port
const PORT = process.env.PORT || 8080;

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});