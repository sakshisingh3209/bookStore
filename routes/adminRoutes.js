// adminRoutes.js

const express = require('express');
const router = express.Router();
const { increaseStock, decreaseStock } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Middleware to verify admin status
const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Unauthorized: Admin access required' });
    }
};

// Admin routes for managing stock
router.put('/:id/increase-stock', authMiddleware.authenticateJWT, isAdmin, increaseStock);
router.put('/:id/decrease-stock', authMiddleware.authenticateJWT, isAdmin, decreaseStock);

module.exports = router;