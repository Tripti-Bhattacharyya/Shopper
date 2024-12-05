// backend/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
export const isAdmin = async (req, res, next) => {
  try {
    const user = req.user; 
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admins only' });
    }
    
    next(); // User is an admin, proceed.
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
