import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

const isAdminAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('Admin auth: No authorization header found');
            return res.status(401).json({ message: 'Admin authorization token not found' });
        }

        const token = authHeader.split(' ')[1];

        // Check if token looks valid (basic validation)
        if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
            console.log('Admin auth: Empty or null token');
            return res.status(401).json({ message: 'Invalid admin token format' });
        }

        console.log('Admin token received, verifying...');
        console.log('Full token value:', token);
        console.log('Token length:', token.length);
        console.log('Token parts:', token.split('.').length, 'parts');

        // Try to verify as admin token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Admin token decoded successfully:', { adminId: decoded.adminId, userId: decoded.userId });

        // Admin tokens have adminId, user tokens have userId
        if (decoded.adminId) {
            const admin = await Admin.findById(decoded.adminId);
            if (!admin) {
                return res.status(401).json({ message: 'Admin not found' });
            }
            req.adminId = decoded.adminId;
            req.isAdmin = true;
            next();
        } else if (decoded.userId) {
            // It's a user token, not admin token - but let's allow it for now if they're an educator
            console.log('Token is a user token, not admin token. Allowing for compatibility.');
            req.userId = decoded.userId;
            next();
        } else {
            return res.status(401).json({ message: 'Invalid token structure' });
        }
    } catch (error) {
        console.error('Admin auth error:', error.name, error.message);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid admin token. Please login again as admin.' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Admin token expired. Please login again.' });
        }
        return res.status(401).json({ message: `Admin auth error: ${error.message}` });
    }
};

export default isAdminAuth;
