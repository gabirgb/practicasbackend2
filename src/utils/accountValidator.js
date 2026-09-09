import { isISO8601Date } from "./dateValidator.js";

// Validar formato estándar de email (usuario@dominio.com)
export const isValidEmail = (email) => {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
};

// Validar complejidad/longitud de contraseña (mínimo 8 caracteres)
export const isValidPassword = (password) => {
    if (!password || typeof password !== 'string') return false;
    return password.length >= 8;
};