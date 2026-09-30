import { sanitizeInput } from "../utils/sanitizer.js";
import { validateCreateUserData } from "../helpers/userValidator.js";
import { hashPassword } from '../utils/crypto.js'
import { UsersDTO } from "../dto/UsersDTO.js";
import { BadRequestError, ConflictError, NotFoundError } from "../utils/CustomError.js";

// creo la clase
export class UsersServices {
    constructor(usersDAO) {
        this.usersDAO = usersDAO; //el this se refiere al objeto actual.
    }

    getAllUsers = async (queryParams) => {
        const users = await this.usersDAO.getAll(queryParams);

        // Si no hay usuarios
        if (!users || users.length === 0) {
            throw new NotFoundError('No hay usuarios que coincidan con los criterios de busqueda');
        }

        return users;
    }

    getUsersById = async (id) => {
        const user = await this.usersDAO.getById(id);

        // Si no hay usuarios
        if (!user) {
            throw new NotFoundError(`No se encontró al usuario con id ${id}`);
        }

        return user;
    }

    getUsersByEmail = async (email) => {
        let user = await this.usersDAO.getByEmail(email);

        if (!user) {
            throw new NotFoundError(`No se encontró al usuario con email ${email}`);
        }
    }

    createUser = async (rawUserData) => {

        // 1. Ejecuto la validación en el helper userValidator pasando el body de la petición
        // campos obligatorios, formato de email, largo del password, fecha de nacimiento (edad >=18), rol válido
        const validation = validateCreateUserData(rawUserData);
        // 2. Si hay errores de validación, cortamos el flujo y devolvemos 400
        if (!validation.isValid) {
            throw new BadRequestError(validation.error);
        }

        // 3. Verificamos si el email ya existe en la base de datos (Regla de negocio adicional)
        const existingUser = await this.usersDAO.getByEmail(rawUserData.email);

        if (existingUser) {
            throw new ConflictError('El email ya se encuentra registrado.');
        }

        // 3. Sanitización y transformación de datos
        const hashedPassword = await hashPassword(rawUserData.password);

        // sanitizo campos de texto
        const cleanUserData = {
            firstName: sanitizeInput(rawUserData.firstName),
            lastName: sanitizeInput(rawUserData.lastName),
            email: rawUserData.email.toLowerCase().trim(),
            password: hashedPassword,
            isActive: rawUserData.isActive !== undefined ? rawUserData.isActive : true,
        }

        //Cuando termino de sanitizar y validar, encripto el pass para que a continuacion viaje a la BD ya hasheado, y no se almacena en texto plano
        // 4. Si todo está ok, procedemos a crear el usuario en el DAO con la data ya validada y sanitizada
        const newUser = await this.usersDAO.create(cleanUserData);

        // 5. Retorno formateado mediante DTO
        return new UsersDTO(newUser);
    }
}