import express from 'express';
import fileUpload from 'express-fileupload';
import fs from 'fs';

import User from '../models/user';
import Doctor from '../models/doctor';
import Hospital from '../models/hospital';

const upload = express();

upload.use(fileUpload());

upload.put('/:type/:id', (req, res) => {
    const { type, id } = req.params;

    // Tipos de Colección
    const validTypes = ['hospitals', 'doctors', 'users'];
    if (validTypes.indexOf(type) < 0) {
        return res.status(400).json({ message: 'Tipo de colección no válida' });
    }

    if (!req.files) {
        return res.status(400).json({ message: 'No seleccionó nada' });
    }

    // Obtener nombre del archivo
    const file = req.files.img;
    const fileName = file.name.split('.');
    const fileExtension = fileName[fileName.length - 1];

    // Solo extensiones de imagen
    const validExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp'];

    if (validExtensions.indexOf(fileExtension) < 0) {
        return res.status(400).json({ message: 'El formato del archivo no corresponde a una imagen' });
    }

    // Nombre de archivo personalizado
    const customName = `${id}-${new Date().getMilliseconds()}.${fileExtension}`;

    // Mover el archivo del temporal a un path
    const path = `./uploads/${type}/${customName}`;

    file.mv(path, err => {
        if (err) {
            return res.status(500).json({ message: 'Ha ocurrido un error al mover el archivo', error: err });
        }

        uploadByType(type, id, customName, res);
        //
    });

});

const uploadByType = (type, id, fileName, res) => {
    switch (type) {
        case 'users':
            User.findById(id)
                .then(user => {
                    if (!user) return res.status(404).json({ message: 'El usuario no existe' });
                    if (user.img) {
                        const oldPath = `./uploads/users/${user.img}`;
                        // Si existe, elimina la imagen anterior
                        if (fs.existsSync(oldPath)) {
                            fs.unlink(oldPath, (err) =>{
                                if (err) return res.status(400).json({ message: 'Que está pasandooooo', err });
                            });
                        }
                    }
                    user.img = fileName;
                    user.save((err, userUpdated) => {
                        return res.status(200).json({ message: 'Imagen de usuario actualizada', user: userUpdated });
                    });
                    });
        break;
        case 'doctors':
            Doctor.findById(id)
            .then(doctor => {

                if (doctor.img) {
                    const oldPath = `./uploads/doctors/${doctor.img}`;
                    // Si existe, elimina la imagen anterior
                    if (fs.existsSync(oldPath)) {
                        fs.unlink(oldPath, (err) =>{
                            if (err) return res.status(400).json({ message: 'Que está pasandooooo' });
                        });
                    }
                }
                doctor.img = fileName;
                doctor.save((err, doctorUpdated) => {
                    return res.status(200).json({ message: 'Imagen de médico actualizada', doctor: doctorUpdated });
                });
            });
        break;
        case 'hospitals':
            Hospital.findById(id)
            .then(hospital => {
                if (hospital.img) {
                    const oldPath = `./uploads/hospitals/${hospital.img}`;
                    // Si existe, elimina la imagen anterior
                    if (fs.existsSync(oldPath)) {
                        fs.unlink(oldPath, (err) =>{
                            if (err) return res.status(400).json({ message: 'Que está pasandooooo' });
                        });
                    }
                }
                hospital.img = fileName;
                hospital.save((err, hospitalUpdated) => {
                    return res.status(200).json({ message: 'Imagen de médico actualizada', hospital: hospitalUpdated });
                });
            });

        break;
        default:
        break;
    }
};

export default upload;
