const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders, getOrdersByUser, updateOrder, deleteOrder, processPayment, confirmOrder } = require('../controllers/orderController');

// Routes for orders
router.post('/', createOrder);
router.get('/', getAllOrders);
router.get('/user/:userId', getOrdersByUser);
router.put('/:orderId', updateOrder);
router.delete('/:orderId', deleteOrder);
router.put('/confirm/:orderId', confirmOrder);
router.post('/process-payment', processPayment);
module.exports = router;