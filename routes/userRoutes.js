const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {

    getUserById,
    updateUser,
    deleteUser,
} = require('../controllers/userController');

// Define routes

router.get('/:id', authMiddleware, getUserById); // Get user by ID (protected)
router.put('/:id', authMiddleware, updateUser); // Update user details (protected)
router.delete('/:id', authMiddleware, deleteUser); // Delete a user (protected)

module.exports = router;