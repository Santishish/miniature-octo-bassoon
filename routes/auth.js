import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../middlewares/auth';

import GoogleAuth from 'google-auth-library';

const app = express();
const auth = new GoogleAuth;

// Autenticación normal
app.post('/', (req, res) => {
    const body = req.body;

    if (body.password) {
        User.findOne({
            email: body.email
        }, (err, user) => {
            if (err) return res.status(500).json({
                message: 'Error al intentar iniciar sesión'
            });
            if (!user) return res.status(404).json({
                message: 'Credenciales incorrectas'
            });
            if (!bcrypt.compareSync(body.password, user.password)) return res.status(400).json({
                message: 'Credenciales incorrectas'
            });
            // Crear token
            user.password = ':)';
            const token = jwt.sign({
                user
            }, process.env.APP_SECRET, {
                expiresIn: 14400
            }); // 4 horas
            res.status(200).json({
                user,
                token,
                id: user._id,
                menu: getMenu(user.role)
            });
        });
    } else {
        return res.status(400).json({
            message: 'Ingrese la contraseña'
        });
    }
});

// Autenticación con Google
app.post('/google', (req, res) => {
    let token = req.body.token || 'Yolo';

    const client = new auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_SECRET, '');

    client.verifyIdToken(
        token,
        process.env.GOOGLE_CLIENT_ID,
        (e, login) => {
            if (e) return res.status(400).json({
                message: 'Token no válido',
                errors: e
            });

            const payload = login.getPayload();
            const userId = payload['sub'];

            User.findOne({
                    email: payload.email
                })
                .then(user => {
                    // Si el usuario existe por correo
                    if (user) {
                        if (!user.google) return res.status(400).json({
                            message: 'Debe de usar su autenticación normal'
                        });
                        user.password = ':)';
                        const token = jwt.sign({
                            user
                        }, process.env.APP_SECRET, {
                            expiresIn: 14400
                        }); // 4 horas
                        res.status(200).json({
                            user,
                            token,
                            id: user._id,
                            menu: getMenu(user.role)
                        });
                    } else {
                        // Si el usuario no existe por correo
                        const user = new User();

                        user.name = payload.name;
                        user.email = payload.email;
                        user.password = ':)';
                        user.img = payload.picture;
                        user.google = true;

                        User.create(user)
                            .then(userCreated => {
                                const token = jwt.sign({
                                    userCreated
                                }, process.env.APP_SECRET, {
                                    expiresIn: 14400
                                }); // 4 horas
                                res.status(200).json({
                                    userCreated,
                                    token,
                                    menu: getMenu(userCreated.role)
                                });
                            })
                            .catch(err => res.status(500).json({
                                message: 'Error al crear usuario',
                                errors: err
                            }));
                    }
                })
                .catch(err => res.status(500).json({
                    message: 'Error al buscar usuario',
                    errors: err
                }))
        }
    )
});

// Renovar token
app.get('/renewtoken', verifyToken, (req, res) => {
    const token = jwt.sign({ user: req.user }, process.env.APP_SECRET, { expiresIn: 14400 }); // 4 horas
    res.status(200).json({ token });
});

const getMenu = (ROLE) => {
    const menu = [{
        titulo: 'Principal',
        icono: 'mdi mdi-gauge',
        submenu: [{
            titulo: 'Dashboard',
            url: '/dashboard'
        }, {
            titulo: 'Progress Bar',
            url: '/progress'
        }, {
            titulo: 'Gráficas',
            url: '/graficas1'
        }, ]
    }, {
        titulo: 'Mantenimientos',
        icono: 'mdi mdi-folder-lock-open',
        submenu: [
        // {
        //     titulo: 'Usuarios',
        //     url: '/users'
        // },
        {
            titulo: 'Hospitales',
            url: '/hospitals'
        },
        {
            titulo: 'Médicos',
            url: '/doctors'
        }
        ]
    }];

    if (ROLE === 'ADMIN_ROLE') {
        menu[1].submenu.unshift({titulo: 'Usuarios', url: '/users'})
    }

    return menu;
};

export default app;