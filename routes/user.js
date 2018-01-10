import express from 'express';
import bcrypt from 'bcryptjs';
import pagination from 'mongoose-pagination';

import { verifyToken } from '../middlewares/auth';

import User from '../models/user';

const user = express();

// Obtener todos los usuarios

user.get('/:page?', (req, res) => {
    let page;
    req.params.page ? page = req.params.page : page = 1;

    User.find({}, 'name email img role')
        .paginate(page, 5)
        .then(users => {
            if (users.length === 0) return res.status(404).json({ message: 'No se encontraron usuarios' });
            res.status(200).json({ users });
        })
        .catch(err => res.status(500).json({ message: 'Error cargando usuarios', errors: err }));   
});

// Crear usuario
user.post('/', (req, res) => {
    const body = req.body;
    const user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    user.save((err, userStored) => {
        if (err) return res.status(400).json({ message: 'Ocurrió un error al crear', errors: err });
        if (userStored) {
            res.status(201).json({ userStored });
        }
    });
});

// Actualizar usuario
user.put('/:id', verifyToken,(req, res) => {
    const id = req.params.id;
    const body = req.body;

    User.findById(id, (err, user) => {
        if (err) return res.status(500).json({ message: 'Ocurrió un error', errors: err });
        if (!user) {
            return res.status(404).json({ message: 'El usuario no existe' });
        } else {
            user.name = body.name;
            user.email = body.email;
            user.role = body.role;

            user.save((err, userUpdated) => {
                if (err) return res.status(400).json({ message: 'Ocurrió un error al actualizar', errors: err });
                userUpdated.password = ':)'
                res.status(200).json({ userUpdated });

            });
        }
    });
});

// Borrar un usuario por id
user.delete('/:id', verifyToken, (req, res) => {
    const id = req.params.id;
    User.findByIdAndRemove(id, (err, userDeleted) => {
        if (err) return res.status(500).json({ message: 'Ocurrió un error al eliminar', errors: err });
        if (!userDeleted) {
            res.status(404).json({ message: 'El usuario no existe' });
        } else {
            res.status(200).json({ userDeleted });
        }
    });
});

export default user;