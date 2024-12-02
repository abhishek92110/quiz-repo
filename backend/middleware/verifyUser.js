const jwt = require('jsonwebtoken');
const user = require("../model/User")

// Secret key for JWT
const JWT_SECRET = 'www'; // Replace with a secure secret key

// Middleware to verify token
const verifyUserToken = async(req, res, next) => {
    
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
        req.course = decoded.course; // Attach user ID to the request object

        req.message=''

        const userData = await user.find({email:decoded.userEmail})
        console.log("userData =",userData, decoded.userEmail)

        if(userData.length>0){

            req.message=true

        }

        else{
            req.message=false
        }

        next(); // Proceed to the next middleware/route handler
    }
     catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ status: false, error: 'Invalid or expired token' });
    }
};

module.exports = verifyUserToken;
