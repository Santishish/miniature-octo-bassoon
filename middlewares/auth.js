import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.query.token;
    jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token incorrecto' });
        
        req.user = decoded.user;
        next();
    });
};

export const verifyAdminRole = (req, res, next) => {
	const user = req.user;
	if (user.role === 'ADMIN_ROLE') {
		next();
	} else {
		if (err) return res.status(401).json({ message: 'Token incorrecto' });
	}
};

export const verifyAdminOrSelf = (req, res, next) => {
	const user = req.user;
	const {id} = req.params;
	if (user.role === 'ADMIN_ROLE' || user._id === id) {
		next();
	} else {
		if (err) return res.status(401).json({ message: 'Token incorrecto' });
	}
};
