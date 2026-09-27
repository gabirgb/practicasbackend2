import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

/**
 * Genera un token JWT firmado con el payload proporcionado.
 * param {Object} payload - Datos del usuario a incluir en el token.
 * returns {String} Token firmado.
 */
export const generateToken = (payload) => {
    return jwt.sign(
        payload,
        config.general.JWT_SECRET,
        { expiresIn: config.general.JWT_EXPIRES_IN }
    );
};

/**
 * Verifica y decodifica un token JWT.
 * param {String} token - Token JWT recibido.
 * returns {Object} Payload decodificado si es válido.
 * throws {Error} Lanza excepción si el token expiró o es inválido.
 */
export const verifyToken = (token) => {
    return jwt.verify(token, config.general.JWT_SECRET);
};