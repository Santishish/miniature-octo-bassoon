
const express = require('express');
const mongoose = require('mongoose');

const port = 8081;

const app = express();
// const router = express.Router();

// Conexión
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;

    console.log(`Base de datos \x1b[32m%s\x1b[0m`, 'online');
})

// Rutas
app.get('/', (req, res) => {
    res.status(200).json({ message: 'OK' });
});

app.listen(port, () => {
    console.log(`Servidor express corriendo en el puerto ${port}: \x1b[32m%s\x1b[0m`, 'online');
});