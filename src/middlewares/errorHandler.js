// la idea es que cuando implementemos corretamente el manejo de errores, dependiendo del tipo de error mostremos un msje diferente. Por ahora solo ponemos 1.
export const errorHandler = (err, req, res, next) => {
    // 1. Siempre imprime por consola en tu terminal para desarrollo
    console.error("DEBUG ERROR HANDLER ->", err);

    res.setHeader('Content-Type', 'application/json');

    // 2. Error de validación de Mongoose
    if (err.name === 'ValidationError') {
        const errorsDetails = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            status: 'error',
            errorType: 'ValidationError',
            message: 'Falló la validación del esquema de Mongoose',
            details: errorsDetails
        });
    }

    // 3. Error de campo duplicado en MongoDB (código 11000)
    if (err.code === 11000) {
        const duplicateField = Object.keys(err.keyValue)[0];
        const duplicateValue = err.keyValue[duplicateField];
        return res.status(409).json({
            status: 'error',
            errorType: 'DuplicateKey',
            message: `El campo '${duplicateField}' con valor '${duplicateValue}' ya existe.`
        });
    }

    // 4. Errores con status customizado (opcional) o 500 por defecto
    const statusCode = err.status || err.statusCode || 500;

    return res.status(statusCode).json({
        status: 'error',
        message: err.message || 'Internal server error',
        debug: {
            name: err.name,
            stack: err.stack
        }
    });
};