const User = require('../models/user');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware')

// Register a new user
const registerController = async(req, res) => {
    const { username, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({
            username,
            email,
            password,
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Login a user
const loginController = async(req, res) => {

    const { email, password } = req.body;
    try {
        if (!email || !password) {
            next('Please provide all fields');
        }
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            next('Invalid Username or password');
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            next('Invalid Username or password');
        }
        const token = user.createJWT();
        res.status(200).json({
            success: true,
            message: "Login Successfully",
            user: {
                name: user.name,
                email: user.email,
                location: user.location,
            },
            token,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');

    }
}


//funciton to logout user

const logoutController = async(req, res) => {
    res.status(200).json({ message: 'Logout successfully' });
}


//function to delete user account
const deleteAccountController = async(req, res) => {
    try {
        const userId = req.user.id;
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error in deleting account:', error);
        res.status(500).json({ message: 'Error deleting account' });

    }
}


module.exports = { loginController, registerController, logoutController, deleteAccountController };