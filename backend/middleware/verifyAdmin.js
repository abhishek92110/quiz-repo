const jwt = require('jsonwebtoken');
const admin  = require('../model/Admin')

// Secret key for JWT
const JWT_SECRET = 'www'; // Replace with a secure secret key

// Middleware to verify token
const verifyAdminToken = async(req, res, next) => {
    
    console.log("verify user")

    const token = req.header("token");
    console.log("token verify admin =",token)

    if (token==null) {
        console.log("token is empty")
        return res.status(400).json({ status: false, error: 'Token is required' });
    }
    else{

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // req.userId = decoded.Id; // Attach user ID to the request object
        // req.userName = decoded.email; // Attach user ID to the request object
        req.message=''

        const adminData = await admin.find({email:decoded.email})

        if(adminData.length>0){

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
}
};

module.exports = verifyAdminToken;
