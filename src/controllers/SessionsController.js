import { UsersDTO } from "../dto/UsersDTO.js";
import { comparePassword } from "../utils/crypto.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
// creo la clase
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
        let { email, password } = req.body;
        if (!email || !password) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({
                status: 'error',
                message: 'Email y contraseña son requeridos'
            });
        }

        try {
            let user = await this.usersDAO.getByEmail(email);
            if (!user) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(404).json({
                    status: 'error',
                    message: 'Credenciales inválidas.'
                });
            }

            if (!comparePassword(password, user.password)) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(401).json({
                    status: 'error',
                    message: 'Credenciales inválidas.'
                });
            }

            // JWT
            // Firmo los datos del usuario y creo el token
            //hay que quitar la info sensible de user.
            // recordar que si la info la traigo desde una BD de mongo hay q apanar el objeto con toJason() o lean() porque si no el token da error.
            // el sign() lleva 3 objetos de param: usuario, PASS DEL QUE FIRMA (o sea yo) y expiredIn
            // 1. Limpias el usuario dejando solo los datos necesarios con el DTO
            const userPayload = new UsersDTO(user);

            // 2. Firmas el token
            const token = jwt.sign(

                { ...userPayload },// Convertimos el DTO a un objeto plano con el operador Spread
                config.general.JWT_SECRET, // Clave secreta obtenida de process.env.JWT_SECRET
                { expiresIn: '24h' } // Es recomendable definir un tiempo de expiración
            );

            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({
                status: 'success',
                message: `Bienvenido ${user.firstName} ${user.lastName}`,
                user: userPayload, // Devolver solo los campos necesarios usando DTO  
                token // aqui le paso el token al FE para q lo guarde mediante localStorage
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/sessions/logout
    // Con JWT el servidor es stateless (sin estado). 
    // El logout se gestiona principalmente en el cliente eliminando el token guardado.
    //     Cuando usas JWT y lo envías en el header Authorization: Bearer <token>, el servidor no guarda el token en ningún lado (no hay estado en la base de datos ni en la memoria del servidor).

    // Por lo tanto:

    // El servidor no puede borrar un token que está almacenado en el navegador del cliente (como en localStorage o sessionStorage).

    // El backend solo responde con un mensaje de éxito (200 OK).

    // Es el cliente (Frontend) quien debe eliminar el token de su almacenamiento al recibir esta respuesta:

    // JavaScript
    logout = async (req, res, next) => {
        try {
            // destroy acepta un callback con un param de error 
            req.session.destroy((error) => {
                if (error) {
                    res.setHeader('Content-Type', 'application/json');
                    return res.status(500).json({
                        status: 'error',
                        message: `No se pudo cerrar sesión.`
                    });
                }
                //limpia la cookie de sesion por defecto
                res.clearCookie('connect.sid');

                res.setHeader('Content-Type', 'application/json');
                return res.status(200).json({
                    status: 'success',
                    message: 'Gracias por visitarnos.'
                });
            });

        } catch (error) {
            next(error);
        }
    }

}