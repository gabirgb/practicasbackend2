/*
Requisito,              Función a Invocar,                      Formato Esperado
Fecha de nacimiento,    validateBirthDate(birth),               """1998-05-20"""
Rango de búsqueda,      "validateDateRange(from, to)",          """2026-01-01"", ""2026-01-31"""
Horario de evento,      "validateEventHours(start, end)",       """18:00"", ""22:00"""
Fecha de evento,        "validateEventStartDate(startDate)",    """2026-10-15T20:00:00Z"""

*/
import {
    isValidSimpleDate,
    isISO8601Date,
    isValidTimeFormat,
    isFutureDate,
    isDateBeforeOrEqual,
    calculateAge,
    isTimeBefore
} from '../utils/dateValidator.js';

// Req 1 & 3: Fecha de Nacimiento (YYYY-MM-DD + Mayoría de edad)
export const validateBirthDate = (birth) => {
    if (!birth) {
        return { isValid: false, error: 'La fecha de nacimiento es obligatoria' };
    }

    if (!isValidSimpleDate(birth)) {
        return {
            isValid: false,
            error: 'La fecha de nacimiento debe tener el formato YYYY-MM-DD'
        };
    }

    if (calculateAge(birth) < 18) {
        return { isValid: false, error: 'El usuario debe ser mayor de 18 años' };
    }

    return { isValid: true };
};

// Req 2: Búsqueda de Eventos por Rango de Fechas (fromDate y toDate)
export const validateDateRange = (fromDate, toDate) => {
    if (fromDate && !isValidSimpleDate(fromDate)) {
        return { isValid: false, error: 'fromDate debe tener el formato YYYY-MM-DD' };
    }

    if (toDate && !isValidSimpleDate(toDate)) {
        return { isValid: false, error: 'toDate debe tener el formato YYYY-MM-DD' };
    }

    if (fromDate && toDate && !isDateBeforeOrEqual(fromDate, toDate)) {
        return { isValid: false, error: 'fromDate debe ser menor o igual que toDate' };
    }

    return { isValid: true };
};

// Req 4: Horarios del evento (startTime y endTime)
export const validateEventHours = (startTime, endTime) => {
    if (!isValidTimeFormat(startTime) || !isValidTimeFormat(endTime)) {
        return { isValid: false, error: 'Los horarios deben tener el formato HH:mm (24 horas)' };
    }

    if (!isTimeBefore(startTime, endTime)) {
        return { isValid: false, error: 'El horario de inicio debe ser anterior al de finalización' };
    }

    return { isValid: true };
};

// Req 1: Fecha de inicio del evento (Formatos ISO8601 + Futura)
export const validateEventStartDate = (startDate) => {
    if (!startDate || !isISO8601Date(startDate)) {
        return {
            isValid: false,
            error: 'La fecha del evento debe usar formato ISO 8601 (ej: 2026-10-15T20:00:00Z)'
        };
    }

    if (!isFutureDate(startDate)) {
        return { isValid: false, error: 'La fecha del evento debe ser posterior a la actual' };
    }

    return { isValid: true };
};