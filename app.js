import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import Promise from 'bluebird';

import appRoutes from './routes/app'
import user from './routes/user';
import auth from './routes/auth';
import hospital from './routes/hospital';
import doctor from './routes/doctor';
import search from './routes/search';
import upload from './routes/upload';
import imgRoutes from './routes/images';
const app = express();

// CORS Settings
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  next();
});

dotenv.config();

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Conexión
mongoose.Promise = Promise;
mongoose.connection.openUri(process.env.MONGODB_URL, (err, res) => {
    if (err) throw err;

    console.log(`Base de datos \x1b[32m%s\x1b[0m`, 'online');
});

// Server Index config
// import serveIndex from 'serve-index';
// app.use(express.static(__dirname + '/'));
// app.use('/uploads', serveIndex(__dirname + '/uploads'));

// Rutas
app.use('/api', appRoutes);
app.use('/api/login', auth)
app.use('/api/users', user)
app.use('/api/hospitals', hospital);
app.use('/api/doctors', doctor);
app.use('/api/search', search);
app.use('/api/upload', upload);
app.use('/api/img', imgRoutes);

app.listen(process.env.BACKEND_PORT, () => {
    console.log(`Servidor express corriendo en el puerto ${process.env.BACKEND_PORT}: \x1b[32m%s\x1b[0m`, 'online');
});
