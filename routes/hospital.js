import express from 'express';
import pagination from 'mongoose-pagination';

import { verifyToken } from '../middlewares/auth';
import Hospital from '../models/hospital';

const hospital = express.Router();

// Obtener todos los hospitales
hospital.get('/paginated/:page?', (req, res) => {
    let page;
    req.params.page ? page = req.params.page : page = 1;

    Hospital.find({})
        .sort('name')
        .paginate(page, 5)
        .populate('user', 'name email user')
        .then(hospitals => {
            Hospital.count({})
                .then(total => res.status(200).json({ total, hospitals }));
        })
        .catch(err => res.status(400).json({ message: 'Ocurrió un error al buscar hospitales', errors: err }))
});

// Obtener todos los hospitales sin paginación
hospital.get('/all', (req, res) => {
    Hospital.find({})
        .populate('user', 'name email user')
        .then(hospitals => res.status(200).json({ hospitals }))
        .catch(err => res.status(500).json({ message: 'Error al realizar la búsqueda', errors: err }));
});

// Obtener un hospital por su ID
hospital.get('/:id', (req, res) => {
    const { id } = req.params;

    Hospital.findById(id)
        .populate('usuario', 'name img email')
        .then(hospital => {
            if (!hospital) return res.status(404).json({ message: 'No existe un hospital con el ID ingresado' });
            res.status(200).json({ hospital });
        })
        .catch(err => res.status(500).json({ message: 'Error al buscar el hospital', errors: err }));
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