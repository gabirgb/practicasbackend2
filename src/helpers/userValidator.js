import { isValidPassword, isValidEmail } from "../utils/accountValidator.js";
import { VALID_USER_ROLES } from "../constants/usersConstants.js";
import { validateBirthDate } from "../helpers/dateValidationRules.js";

export const validateCreateUserData = (userData = {}) => {
    const { firstName, lastName, email, password, birth, role } = userData;

    if (!firstName || typeof firstName !== 'string' || !firstName.trim()) {
        return {
            isValid: false,
            error: 'El nombre es obligatorio y debe ser un texto válido'
        };
    }

    if (!lastName || typeof lastName !== 'string' || !lastName.trim()) {
        return {
            isValid: false,
            error: 'El apellido es obligatorio y debe ser un texto válido'
        };
    }

    if (!isValidEmail(email)) {
        return {
            isValid: false,
            error: 'El formato del email es incorrecto.'
        }
    }

    if (!isValidPassword(password)) {
        return {
            isValid: false,
            error: 'El password debe tener al menos 8 caracteres.'
        }
    }


    if (role && !VALID_USER_ROLES.includes(role.toLowerCase())) {
        return {
            isValid: false,
            error: `El rol '${role}' no es válido. Roles permitidos: ${VALID_USER_ROLES.join(', ')}`
        };
    }

    return { isValid: true };
}