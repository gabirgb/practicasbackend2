import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true,
        minlength: [3, 'El nombre debe tener al menos 2 caracteres'],
    },
    lastName: {
        type: String,
        trim: true,
        minlength: [3, 'El apellido debe tener al menos 2 caracteres'],
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: [10, 'La contraseña debe tener al menos 6 caracteres'], //como va a estar hasheado siempre va a tener mas de 10 caracteres y no se va a poder validar la contraseña en el modelo, tiene que estar por fuera del modelo, en el controlador
    },
    role: {
        type: String,
        enum: ['user', 'manager', 'admin'],
        default: 'user', //siempre se auto-registra al usuario con el rol de menor privilegio, el rol de admin se le asigna manualmente a un usuario ya registrado para evitar filtraciones de seguridad
    },
},
    {
        timestamps: true
    }
);

export default mongoose.model('user', userSchema);