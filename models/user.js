import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};

const userSchema = mongoose.Schema({
    name: { type: String, required: [true, 'El nombre es requerido'] },
    email: { type: String, unique: true, required: [true, 'El email es requerido'] },
    password: { type: String, required: [true, 'La contraseña es requerida'] },
    img: { type: String, required: false, default: '' },
    role: { type: String, required: true, default: 'USER_ROLE', enum: validRoles },
    
});

userSchema.plugin(uniqueValidator, { message: '{PATH} ya existe' });

export default mongoose.model('User', userSchema);
