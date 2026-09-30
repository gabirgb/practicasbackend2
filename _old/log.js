// middleware super sencillo para crear logs, por lo general todo lo q se trate de seguridad se loggea
// la corma correcta es crear un archivo de logs en el ser mediante el uso de fs
export const logger = (req, res, next) => {
    //console.log(`Fecha: ${new Date().toUTCString()} - Url: ${req.baseUrl} - Method: ${req.method}`);
    next();
}