import express from 'express';

import Hospital from '../models/hospital';
import Doctor from '../models/doctor';
import User from '../models/user';

const search = express.Router();


search.get('/all/:query', (req, res) => {
    const query = req.params.query;

    const regex = new RegExp(query, 'i')

    Promise.all([
        searchHospitals(query, regex),
        searchDoctors(query, regex),
        searchUsers(query, regex)
    ])
    .then(result => {
        res.status(200).json({
            hospitals: result[0],
            doctors: result[1],
            users: result[2]
        });
    })
    .catch(err => res.status(400).json({ message: 'Error', errores: err }));

});

search.get('/hospitals/:query', (req, res) => {
    const query = req.params.query;

    const regex = new RegExp(query, 'i');

    Promise.resolve(searchHospitals(query, regex))
        .then(hospitals => res.status(200).json({ hospitals }))
        .catch(err => res.status(400).json({ message: 'Error al realizar la búsqueda', errores: err }))
});

search.get('/doctors/:query', (req, res) => {
    const query = req.params.query;

    const regex = new RegExp(query, 'i');

    Promise.resolve(searchDoctors(query, regex))
        .then(doctors => res.status(200).json({ doctors }))
        .catch(err => res.status(400).json({ message: 'Error al realizar la búsqueda', errores: err }))
});

search.get('/users/:query', (req, res) => {
    const query = req.params.query;

    const regex = new RegExp(query, 'i');

    Promise.resolve(searchUsers(query, regex))
        .then(users => res.status(200).json({ users }))
        .catch(err => res.status(400).json({ message: 'Error al realizar la búsqueda', errores: err }))
});

const searchHospitals = (query = '', regex = new RegExp('')) => {
    return new Promise((resolve, reject) => {
        Hospital.find({ name: regex })
            .populate('user')
            .then(hospitals => {
                resolve(hospitals)
            })
            .catch(err => reject('Error al cargar', err));
    });
};

const searchDoctors = (query = '', regex = new RegExp('')) => {
    return new Promise((resolve, reject) => {
        Doctor.find({ name: regex })
            .populate('user', 'name email img')
            .populate('hospital')
            .then(doctors => {
                resolve(doctors)
            })
            .catch(err => reject('Error al cargar', err));
    });
};

const searchUsers = (query = '', regex = new RegExp('')) => {
    return new Promise((resolve, reject) => {
        User.find({ name: regex })
            .populate('user', 'name email img')
            .populate('hospital')
            .then(users => {
                resolve(users)
            })
            .catch(err => reject('Error al cargar', err));
    });
};


export default search;