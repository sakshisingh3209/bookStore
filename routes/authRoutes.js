const express = require('express');
const router = express.Router();
const { loginController, registerController, logoutController, deleteAccountController } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Register a new user
router.post('/register', registerController);

// Login a user
router.post('/login', loginController);

router.delete('/delete-account', authMiddleware, deleteAccountController);


//route for logout
router.post('/logout', logoutController);

module.exports = router;