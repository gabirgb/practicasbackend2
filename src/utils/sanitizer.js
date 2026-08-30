export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    // convierto caracteres especiales a entidades html para evitar inyeccion xss
    return input
        .trim()
        .replace(/</g, "&lt")
        .replace(/>/g, "&gt");
}