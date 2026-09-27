import { UsersDTO } from "../dto/UsersDTO.js";
import { generateToken } from '../utils/jwt.js';
import { config } from "../config/config.js";

//TODO tiene sentido que el constructor sea con usersDAO si ya no lo uso en la clase?

export class SessionsController {
    constructor(usersDAO) {
        //me traigo el usersDAO para poder usarlo en los métodos de la clase 
        this.usersDAO = usersDAO; //el this se refiere al objeto actual.
    }

    // GET /api/sessions/current
    getCurrentSession = async (req, res, next) => {
        try {
            // traigo los datos del usuario en req.user
            if (!req.user) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(401).json({
                    status: 'error',
                    message: 'No hay usa sesion activa'
                });
            }
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({
                status: 'success',
                user: req.user // El objeto cargado desde el token ya pasó por el DTO al firmarse
            });
        } catch (error) {
            next(error);
        }
    }


    // POST /api/sessions/login
    login = async (req, res, next) => {

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
    }

    // POST /api/sessions/logout
    logout = async (req, res, next) => {
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