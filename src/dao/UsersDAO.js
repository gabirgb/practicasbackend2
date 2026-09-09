import { usersModel } from "../models/usersModel.js";

// el DAO es un patron de diseño que nos dice que todas las conexiones a persistencia sean realizadas desde un mismo objeto (para que no haya conexiones por todos lados sueltas).
export class UsersDAO {
    async get(queryOptions = {}) {
        const { firstName, lastName, email, role, isActive } = queryOptions;
        const mongoQuery = {};

        // 1. Búsqueda por nombre/ ape/ email/ (insensible a mayúsculas/minúsculas y parcial)
        if (firstName) { mongoQuery.firstName = { $regex: firstName, $options: 'i' }; }
        if (lastName) { mongoQuery.lastName = { $regex: lastName, $options: 'i' }; }
        if (email) { mongoQuery.email = { $regex: email, $options: 'i' }; }

        // Búsquedas por valor exacto (enum y boolean)
        if (role) { mongoQuery.role = role.toLowerCase(); }
        if (isActive !== undefined) { mongoQuery.isActive = isActive === 'true'; }

        return await usersModel.find(mongoQuery).lean();
    }

    // aca hay que hacer todo el CRUD, pero por ahora solo vamos a hacer el create y el getby, que es lo que necesitamos para el login y el registro de usuarios. 
    // Busca un usuario por su ID de MongoDB
    async getById(id) {
        return await usersModel.findById(id).lean();
    }

    // Busca un usuario por su Email exacto
    async getByEmail(email) {
        return await usersModel.findOne({ email: email.toLowerCase() }).lean();
    }

    // creamos un usuario
    async create(userData = {}) {
        const newUser = await usersModel.create(userData);
        return newUser.toJSON(); // toJSON() limpia los metadatos internos de Mongoose
    }

}
