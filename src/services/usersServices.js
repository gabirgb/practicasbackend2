import { sanitizeInput } from "../utils/sanitizer.js";
import { validateCreateUserData } from "../helpers/userValidator.js";
import { hashPassword } from '../utils/crypto.js'
import { UsersDTO } from "../dto/UsersDTO.js";

// creo la clase
export class UsersServices {
    constructor(usersDAO) {
        this.usersDAO = usersDAO; //el this se refiere al objeto actual.
    }

    getAllUsers = async (queryParams) => {
        return await this.usersDAO.get(queryParams);
    }

    getUsersById = async (id) => {
        return await this.usersDAO.getById(id);
    }

    getUsersByEmail = async (email) => {
        return await this.usersDAO.getByEmail(email);
    }

    createUser = async (rawUserData) => {

        // 1. Ejecuto la validación en el helper userValidator pasando el body de la petición
        // campos obligatorios, formato de email, largo del password, fecha de nacimiento (edad >=18), rol válido
        let validation = validateCreateUserData(rawUserData);
        // 2. Si hay errores de validación, cortamos el flujo y devolvemos 400
        if (!validation.isValid) {
            const error = new Error(validation.error);
            error.statusCode = 400;
            throw error;
        }

        // 3. Verificamos si el email ya existe en la base de datos (Regla de negocio adicional)
        const existingUser = await this.usersDAO.getByEmail(rawUserData.email);
        if (existingUser) {
            const error = new Error('El email ya se encuentra registrado');
            error.statusCode = 409;
            throw error;
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