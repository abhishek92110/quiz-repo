const jwt = require('jsonwebtoken');

// Secret key for JWT
const JWT_SECRET = 'www'; // Replace with a secure secret key

// Middleware to verify token
const verifyUserToken = (req, res, next) => {
    
    console.log("verify user")

    const token = req.header("token");

    if (!token) {
        return res.status(400).json({ status: false, error: 'Token is required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId; // Attach user ID to the request object
        req.userName = decoded.userName; // Attach user ID to the request object
        req.userEmail = decoded.userEmail; // Attach user ID to the request object
        next(); // Proceed to the next middleware/route handler
    }
     catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ status: false, error: 'Invalid or expired token' });
    }
};

module.exports = verifyUserToken;
