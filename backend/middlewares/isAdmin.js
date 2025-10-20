const isAdmin = (req, res, next) => {
    // Assuming req.user is populated by isAuth middleware
    // And req.user.role contains the user's role
    if (req.user && req.user.role === 'educator') {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied. Only educators can perform this action.' });
    }
};

export default isAdmin;
