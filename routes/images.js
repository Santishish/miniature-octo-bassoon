import express from 'express';
import fs from 'fs';

const imgRoutes = express();

imgRoutes.get('/:type/:img', (req, res) => {
    const { type, img } = req.params;
    let path = `./uploads/${type}/${img}`;

    fs.exists(path, fileExists => {
        if (!fileExists) {
            path = './assets/no-img.jpg';
        }   
        res.sendfile(path);
    });
});

export default imgRoutes;