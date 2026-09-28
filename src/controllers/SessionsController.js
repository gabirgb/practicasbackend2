import { UsersDTO } from "../dto/UsersDTO.js";
import { generateToken } from '../utils/jwt.js';
import { config } from "../config/config.js";

// NO tiene sentido que la estructura de sessionsController siga siendo una clase porque ya no instancio objetos con su controlador, asi q la cambio a Objeto de funciones:

export const sessionsController = {
    //no se usa mas
    // constructor(usersDAO) {
    //     this.usersDAO = usersDAO;
    // }

    // GET /api/sessions/current
    // getCurrentSession = async (req, res, next) => {
    getCurrentSession: async (req, res, next) => {
        try {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({
                status: 'success',
                user: req.user // El objeto cargado desde el token ya pasó por el DTO al firmarse
            });
        } catch (error) {
            next(error);
        }
    }, //agrego la coma porque ahora es una f dentro de un obj

    // POST /api/sessions/login
    login: async (req, res, next) => {

        try {
            //  recordar q el user cuando uso passport viene dentro de req.user
            const userDTO = new UsersDTO(req.user);
            const userPayload = { ...userDTO };
            const token = generateToken(userPayload);

            res.cookie("cookietokenpass", token, {
                httpOnly: true,
                secure: config.general.NODE_ENV === 'production', // Solo se envía sobre HTTPS
                sameSite: 'lax', // para protejer contra ataques CSRF
                maxAge: 24 * 60 * 60 * 1000, // 86,400,000 ms (24 horas)
                path: '/'
            })

            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({
                status: 'success',
                message: `Bienvenido ${req.user.firstName} ${req.user.lastName}`,
                user: userPayload, // Devolver solo los campos necesarios usando DTO  
            });
        } catch (error) {
            next(error);
        }
    },

    // POST /api/sessions/logout
    logout: async (req, res, next) => {
        try {

            res.clearCookie('cookietokenpass', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/'
            });

            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({
                status: 'success',
                message: 'Sesión cerrada correctamente. ¡Gracias por visitarnos!'
            });
        } catch (error) {
            next(error);
        }
    }

}