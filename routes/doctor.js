import express from 'express';
import { verifyToken } from '../middlewares/auth';

import Doctor from '../models/doctor';

const routes = express.Router();

// Buscar todos los doctores
routes.get('/:page?', (req, res) => {
    let page;
    req.params.page ? page = req.params.page : page = 1;

    Doctor.find({})
        .sort('name')
        .paginate(page, 5)
        .populate('user', 'name email')
        .populate('hospital', 'name img')
        .then(doctors => {
            if (doctors.length === 0) return res.status(404).json({ message: 'No se encuentran doctores registrados' });
            res.json({ doctors })
        })
        .catch(err => res.status(400).json({ message: 'Error al buscar doctores', errors: err }));
});

// Crear un doctor
routes.post('/', verifyToken, (req, res) => {
    const { name, hospital } = req.body;
    const user = req.user._id;

    Doctor.create({ name, user, hospital })
        .then(doctorCreated => res.json({ doctor: doctorCreated }))
        .catch(err => res.status(400).json({ message: 'No se pudo registrar al médico', errors: err }));
});

// Actualizar un doctor
routes.put('/:id', verifyToken, (req, res) => {
    const { name, hospital } = req.body;
    const id = req.params.id;
    const newData = { name, hospital };

    Doctor.findByIdAndUpdate(id, newData)
        .then(doctorUpdated => {
            if (!doctorUpdated) return res.status(404).json({ message: 'No existe un médico con el ID proporcionado' });
            res.json({ doctor: doctorUpdated });
        })
        .catch(err => res.status(400).json({ message: 'Ocurrio un error al actualizar', errores: err }));
});

// Eliminar un doctor
routes.delete('/:id', verifyToken, (req, res) => {
    const id = req.params.id;

    Doctor.findByIdAndRemove(id)
        .then(doctorRemoved => {
            if (!doctorRemoved) return res.status(404).json({ message: 'No existe un médico con el ID proporcionado' });
            res.json({ doctor: doctorRemoved });
        })
        .catch(err => res.status(400).json({ message: 'Ocurrio un error al eliminar', errores: err }));
});

export default routes;