const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

// Define the user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        isAdmin: 'false'
    },
    name: {
        type: String,
        trim: true,
    },

    address: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
    },
    orderHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
    }],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
    }],
    phoneNumber: {
        type: String,
        trim: true,
    },

});

// Pre-save middleware to hash the password before saving the user
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Method to compare the password for login
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
//create token
userSchema.methods.createJWT = function() {
    return JWT.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

const User = mongoose.model('User', userSchema);

module.exports = User;