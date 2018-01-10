import express from 'express';
import pagination from 'mongoose-pagination';

import { verifyToken } from '../middlewares/auth';
import Hospital from '../models/hospital';

const hospital = express.Router();

// Obtener todos los hospitales
hospital.get('/:page?', (req, res) => {
    let page;
    req.params.page ? page = req.params.page : page = 1;

    Hospital.find({})
        .sort('name')
        .paginate(page, 5)
        .populate('user', 'name email user')
        .then(hospitals => {
            if (hospitals.length === 0) return res.status(404).json({ message: 'No hay hospitales registrados' });
            res.status(200).json({ hospitals });
        })
        .catch(err => res.status(400).json({ message: 'Ocurrió un error al buscar hospitales', errors: err }))
});

// Crear un hospital
hospital.post('/', verifyToken, (req, res) => {
    const { name } = req.body;
    const userId = req.user._id;

    Hospital.create({ name, user: userId })
        .then(hospitalCreated => {
            res.status(200).json({ hospital: hospitalCreated });
        })
        .catch(err => res.status(400).json({ message: 'Ocurrió un error', errores: err }));
});

// Modificar un hospital
hospital.put('/:id', verifyToken, (req, res) => {
    const id = req.params.id;
    const { name } = req.body;

    Hospital.findById(id)
        .then(hospital => {
            hospital.name = name;
            
            hospital.save()
                .then(hospitalUpdated => res.status(200).json({ hospital: hospitalUpdated }))
                .catch(err => res.status(400).json({ message: 'Ocurrió un error al actualizar el usuario', errors: err }));
        })
        .catch(err => res.status(400).json({ message: 'No existe un hospital con el ID proporcionado', errors: err }));
});

// Eliminar un hospital
hospital.delete('/:id', verifyToken, (req, res) => {
    const id = req.params.id;

    Hospital.findByIdAndRemove(id)
        .then(hospitalRemoved => res.status(200).json({ hospital: hospitalRemoved }))
        .catch(err => res.status(400).json({ message: 'No existe un hospital con el ID proporcionado', errores: err }));
});


export default hospital;