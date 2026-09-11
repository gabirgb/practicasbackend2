import mongoose from 'mongoose';
import { USER_ROLE, VALID_USER_ROLES } from '../constants/usersConstants.js';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true,
        minlength: [3, 'El nombre debe tener al menos  3 caracteres'],
    },
    lastName: {
        type: String,
        trim: true,
        minlength: [3, 'El apellido debe tener al menos 3 caracteres'],
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
        enum: {
            values: VALID_USER_ROLES,
            message: '{VALUE} no es un rol válido',
        },
        default: USER_ROLE.CUSTOMER,
        lowercase: true,
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true
    }
);

export const usersModel = mongoose.model(
    'user',
    userSchema
);
