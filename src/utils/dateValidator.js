/**
 * 1. Formatos y Parsing
 */

// Valida formato de fecha simple solo calendario: YYYY-MM-DD
export const isValidSimpleDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;

    // Evita fechas inválidas como 2026-02-31
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
    );
};

// Valida formato ISO 8601 completo con hora y offset/Z
export const isISO8601Date = (dateString) => {
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})$/;
    if (!isoRegex.test(dateString)) return false;
    return !isNaN(Date.parse(dateString));
};

// Valida formato de hora simple de 24h: HH:mm (ej: "09:30", "18:00")
export const isValidTimeFormat = (timeString) => {
    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
    return timeRegex.test(timeString);
};

/**
 * 2. Comparaciones y Cálculo de Edad
 */

// Compara si targetDate es estrictamente posterior a una fecha base (por defecto hoy)
export const isFutureDate = (dateString, baseDate = new Date()) => {
    return new Date(dateString) > baseDate;
};

// Compara si dateA es menor o igual a dateB (YYYY-MM-DD o ISO)
export const isDateBeforeOrEqual = (dateA, dateB) => {
    return new Date(dateA) <= new Date(dateB);
};

// Calcula la edad exacta dada una fecha YYYY-MM-DD
export const calculateAge = (birthDateString) => {
    const [year, month, day] = birthDateString.split('-').map(Number);
    const today = new Date();

    let age = today.getFullYear() - year;
    const monthDiff = today.getMonth() - (month - 1);

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
        age--;
    }

    return age;
};

// Compara si timeA ("08:00") es menor que timeB ("12:00")
export const isTimeBefore = (timeA, timeB) => {
    const [h1, m1] = timeA.split(':').map(Number);
    const [h2, m2] = timeB.split(':').map(Number);

    return h1 < h2 || (h1 === h2 && m1 < m2);
};