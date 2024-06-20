// shippingController.js

const Order = require('../models/order');
const { sendEmailNotifications } = require('../utils/notifications');

// Update shipping status and send notification
const updateShipping = async(req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(orderId, { shippingStatus: status }, { new: true }).populate('user');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Send notification to user via email
        await sendEmailNotifications(
            order.user.email,
            'Shipping Update',
            `Shipping status for your order with ID ${order._id} has been updated to ${status}.`
        );

        res.json({ message: 'Shipping status updated successfully' });
    } catch (error) {
        console.error('Error updating shipping status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = { updateShipping };