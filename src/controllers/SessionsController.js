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
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({
                status: 'success',
                message: 'Endpoint de sesión actual (sin lógica de auth aún)',
                payload: null
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

            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({
                status: 'success',
                message: `Bienvenido ${user.firsName} ${user.lastName}`,
                payload: new UsersDTO(user) // Devolver solo los campos necesarios usando DTO  
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/sessions/logout
    logout = async (req, res, next) => {
        try {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({
                status: 'success',
                message: 'Endpoint de logout (placeholder)'
            });
        } catch (error) {
            next(error);
        }
    }
}