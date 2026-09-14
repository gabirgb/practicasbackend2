import { UsersDTO } from "../dto/UsersDTO.js";
import { comparePassword } from "../utils/crypto.js";

// creo la clase
export class SessionsController {
    constructor(usersDAO) {
        //me traigo el usersDAO para poder usarlo en los métodos de la clase 
        this.usersDAO = usersDAO; //el this se refiere al objeto actual.
    }

    // GET /api/sessions/current (Suele pedirlo el enunciado)
    getCurrentSession = async (req, res, next) => {
        try {
            if (!req.session.user) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(401).json({
                    status: 'error',
                    message: 'No hay usa sesion activa'
                });
            }

            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({
                status: 'success',
                user: new UsersDTO(req.session.user)
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

            //la sesion hay que iniciarla con cada proceso de login que yo implemente, por ej local, Google, gitHub, Facebook, etc.... SIEMPRE Y CUANDO el usuario haya superado las validaciones de inicio de sesion
            //Esto genera una cookie que es lo que vincula al usuario ante el servidor
            //esta misma variable es la que voy a controlar al momento de validar la autenticacion en el middleware auth.js
            req.session.user = user;

            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({
                status: 'success',
                message: `Bienvenido ${user.firstName} ${user.lastName}`,
                user: new UsersDTO(user) // Devolver solo los campos necesarios usando DTO  
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/sessions/logout
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