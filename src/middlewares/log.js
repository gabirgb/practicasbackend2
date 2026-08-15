// middleware super sencillo para crear logs, por lo general todo lo q se trate de seguridad se loggea

export const logger = (req, res, next) => {
    console.log(`Fecha: ${new Date().toUTCString()} - Url: ${req.baseUrl} - Method: ${req.method}`);
    next();
}