// src/middlewares/passportCall.js
import passport from 'passport';
import { UnauthorizedError } from '../utils/CustomError.js';

export const passportCall = (strategy) => {
    return (req, res, next) => {
        // recordar: si el authenticate sale ok passport guarda el return en el req.user
        passport.authenticate(strategy,
            {
                session: false
            },
            /*
            (err, user, info) => { ... }: Es la función personalizada que intercepta los 3 argumentos que devuelve el done() de la estrategia:   - err: Si ocurrió una falla inesperada en el código o base de datos (done(error)).
            - user: El objeto de usuario si la autenticación fue exitosa (done(null, user)).
            - info: El objeto opcional con detalles como { message: '...' } cuando falla la autenticación (done(null, false, info)).   
            */
            (err, user, info) => {
                // 1. Error técnico o de BD -> va al errorHandler
                if (err) return next(err);

                // 2. Si no hay usuario (credenciales inválidas o token ausente/inválido)
                if (!user) {
                    const message = info?.message || info?.toString() || 'No autorizado';
                    return next(new UnauthorizedError(message));
                }

                // 3. Autenticación exitosa: adjuntamos el usuario a la request
                req.user = user;
                next();
            })(req, res, next);

        /* Qué es ese "(req, res, next);" ahi al final???: Es una sintaxis de JavaScript llamada IIFE (Immediately Invoked Function Expression).
 
        Por qué está ahí: passport.authenticate() devuelve un middleware estándar de Express (req, res, next) => { ... }. Al agregar (req, res, next) al final del paréntesis de cierre, estás ejecutando inmediatamente dicho middleware pasándole los objetos de la petición actual (que es "(err, user, info)" )
        */
    };
};