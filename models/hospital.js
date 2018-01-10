import mongoose, { Schema } from 'mongoose';

const hospitalSchema = Schema({
    name: { type: String, required: [true, 'El nombre es requerido'] },
    img: { type: String, required: false, default: '' },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

export default mongoose.model('Hospital', hospitalSchema);