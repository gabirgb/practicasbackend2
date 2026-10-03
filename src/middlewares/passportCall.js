// src/middlewares/passportCall.js
import passport from 'passport';
import { UnauthorizedError } from '../utils/CustomError.js';

export const passportCall = (strategy, options = {}) => {
    // recordar: si el authenticate sale ok passport guarda el return en el req.user
    // Definimos las opciones por defecto y combinamos con las que reciba la función
    const defaultOptions = {
        session: false,
        failureMessage: 'No autorizado',
        ...options
    };

    return (req, res, next) => {
        console.log('1. Ingreso al middleware PassportCall:'); //

        passport.authenticate(strategy, defaultOptions,
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
                    // Si configuramos un path de redirección al llamar al middleware:
                    if (defaultOptions.failureRedirect) {
                        // Opcional: puedes adjuntar una query string para informar al frontend del motivo
                        return res.redirect(`${defaultOptions.failureRedirect}?error=access_denied`);
                    }

                    // Si no hay redirección configurada, mantenemos el comportamiento por defecto (401 Error)
                    const message = info?.message || info?.toString() || defaultOptions.failureMessage;
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