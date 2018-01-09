import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import Promise from 'bluebird';

import appRoutes from './routes/app'
import user from './routes/user';
import auth from './routes/auth';

const app = express();

dotenv.config();

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Conexión
mongoose.Promise = Promise;
mongoose.connection.openUri(process.env.MONGODB_URL, (err, res) => {
    if (err) throw err;

    console.log(`Base de datos \x1b[32m%s\x1b[0m`, 'online');
})

// Rutas
app.use('/api', appRoutes);
app.use('/api/login', auth)
app.use('/api/users', user)

app.listen(process.env.BACKEND_PORT, () => {
    console.log(`Servidor express corriendo en el puerto ${process.env.BACKEND_PORT}: \x1b[32m%s\x1b[0m`, 'online');
});