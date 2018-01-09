import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user';
import jwt from 'jsonwebtoken';

const auth = express();

auth.post('/', (req, res) => {
    const body = req.body;

    if (body.password) {
        User.findOne({ email: body.email }, (err, user) => {
            if (err) return res.status(500).json({ message: 'Error al intentar iniciar sesión' });
            if (!user) return res.status(404).json({ message: 'Credenciales incorrectas' });
            if (!bcrypt.compareSync(body.password, user.password)) return res.status(400).json({ message: 'Credenciales incorrectas' });
            // Crear token
            user.password = ':)';
            const token = jwt.sign({ user }, process.env.APP_SECRET, { expiresIn: 14400 }); // 4 horas
            res.status(200).json({ user, token });
        });
    } else {
        return res.status(400).json({ message: 'Ingrese la contraseña' });
    }
});

export default auth;