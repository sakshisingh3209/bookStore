// Assuming this is your shippingRoutes.js file or similar
const express = require('express');
const router = express.Router();
const { updateShipping } = require('../controllers/shippingController');

// Route to update shipping status
router.put('/:orderId/shipping', updateShipping);

module.exports = router;