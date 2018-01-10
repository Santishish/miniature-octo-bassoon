import mongoose, { Schema } from 'mongoose';

const doctorSchema = Schema({
    name: { type: String, required: [true, 'El nombre es requerido'] },
    img: { type: String, required: false, default: '' },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'No hay un usuario'] },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'Se debe asignar a un hospital'] }
});

export default mongoose.model('Doctor', doctorSchema);