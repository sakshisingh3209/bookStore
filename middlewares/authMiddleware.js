const JWT = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authMiddleware = (req, res, next) => {
    // Extract token from headers
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    // Verify token
    JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }

        // If token is valid, save decoded user information to request object
        req.user = decoded;
        next();
    });
};

module.exports = authMiddleware;