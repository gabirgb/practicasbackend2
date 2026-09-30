import { UsersDTO } from "../dto/UsersDTO.js";

export class UsersController {
    constructor(usersServices) {
        this.usersServices = usersServices;
    }

    getUsers = async (req, res, next) => {
        try {
            const users = await this.usersServices.getAllUsers(req.query);
            const usersDTO = users.map(user => new UsersDTO(user));

            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({
                status: `success`,
                payload: usersDTO
            });
        } catch (error) {
            next(error)
        }
    }

    getUsersById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const user = await this.usersServices.getUsersById(id);

            res.setHeader('Content-type', 'application/json');
            return res.status(200).json({
                status: 'success',
                user: new UsersDTO(user)
            });

        } catch (error) {
            next(error);
        }
    }

    getUsersByEmail = async (req, res, next) => {
        try {
            const { email } = req.params;
            const user = await this.usersServices.getUsersByEmail(email);

            res.setHeader('Content-type', 'application/json');
            return res.status(200).json({
                status: 'success',
                user: new UsersDTO(user)
            });
        } catch (error) {
            next(error);
        }
    }

    createUser = async (req, res, next) => {
        try {
            //const newUser = await this.usersServices.createUser(req.body);
            /**
             * cuando registro un usuario nuevo mi usersServices me devuelve:
                return new UsersDTO(newUser);
                
                mi estrategia lo toma y Passport lo adjunta 
                return done(null, newUser)
                
                mi passport.authenticate en el usersRouter toma el objeto y lo adjunta en la propiedad req.user cuando lo envia al usersController

                por lo tanto acá debo tomarlo como req.user
             */
            const newUser = req.user;

            res.setHeader('Content-type', 'application/json');
            return res.status(201).json({
                status: 'success',
                message: 'Usuario creado exitosamente',
                user: newUser // Devolver solo los campos necesarios usando DTO
            });

        } catch (error) {
            // Cualquier error (de validación, duplicados o de Passport) el error handler lo manda directo a "next(error);"
            next(error);

        }
    }

}