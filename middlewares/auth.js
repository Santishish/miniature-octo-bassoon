import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.query.token;
    jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token incorrecto' });
    
        next();
    });
};



