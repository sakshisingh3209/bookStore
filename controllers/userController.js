const User = require('../models/user');

// Get user by ID
const getUserById = async(req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// Update user details
const updateUser = async(req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;
    try {
        let user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.username = username;
        user.email = email;
        user.password = password;

        await user.save();
        res.status(200).json({
            message: 'User updated successfully',
            user
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};
// Delete a user
const deleteUser = async(req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.deleteOne();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};


module.exports = { getUserById, updateUser, deleteUser };