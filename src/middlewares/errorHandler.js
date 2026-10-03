import { config } from "../config/config.js";

export const errorHandler = (err, req, res, next) => {
    // Tomamos los valores del CustomError o los que traiga el error genérico
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'Error interno del servidor';
    const errorType = err.errorType || err.name || 'InternalServerError';

    // Normalizamos la variable eliminando espacios invisibles
    const currentEnv = config.general.NODE_ENV?.trim().toLowerCase();

    if (currentEnv !== 'production') {
        console.error("DEBUG ERROR HANDLER ->", err);

        return res.status(statusCode).json({
            status: 'error',
            errorType,
            message,
            details: err.details || null,
            debug: {
                stack: err.stack,
                body: req.body,
                params: req.params,
                query: req.query
            }
        });
    }

    // PRODUCCIÓN
    const isOperational = err.isOperational || statusCode < 500;

    return res.status(statusCode).json({
        status: 'error',
        message: isOperational ? message : 'Ha ocurrido un error inesperado en el servidor'
    });
};