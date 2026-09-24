//Creo el middleware verifySameOrigin.js para evitar ataques CSRF y para asegurarme de que las peticiones que modifican datos (POST, PUT, DELETE, etc.) provengan exclusivamente de mi propio sitio web.
import { config } from '../config/config.js';

export const verifySameOrigin = (req, res, next) => {
    // 1. Las peticiones de lectura (GET, HEAD, OPTIONS) generalmente no cambian estado,
    //    pero en acciones sensibles (POST/PUT/DELETE) se exige la verificación.
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }

    // 2. Extraemos los encabezados que el navegador envía automáticamente
    const origin = req.headers.origin;
    const referer = req.headers.referer;

    // Dominio permitido (obtenido de tus variables de entorno o configuración)
    const allowedOrigin = config.general.CLIENT_URL || 'http://localhost:3500';

    // 3. Verificación de Origin
    if (origin) {
        if (origin === allowedOrigin) {
            return next();
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(403).json({
                status: 'error',
                message: 'Acceso rechazado: Origen no permitido'
            });
        }
    }

    // 4. Fallback: Si no hay header 'Origin' (común en formularios navegados), verificamos 'Referer'
    if (referer) {
        if (referer.startsWith(allowedOrigin)) {
            return next();
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(403).json({
                status: 'error',
                message: 'Acceso rechazado: Referer no permitido.'
            });
        }
    }

    // 5. Si no incluye ninguno de los dos encabezados en una petición de cambio de estado
    res.setHeader('Content-Type', 'application/json');
    return res.status(403).json({
        status: 'error',
        message: 'Acceso rechazado: Encabezados de origen no presentes'
    });
};