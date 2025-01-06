import jwt from 'jsonwebtoken';

const adminAuth = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (decoded.role !== 'Admin') {
            return res.status(403).json({ message: 'Forbidden: Admin access required' });
        }
        req.admin = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export default adminAuth;