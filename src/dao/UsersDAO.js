import usersModel from "./models/usersModel.js";

// el DAO es un patron de diseño que nos dice que todas las conexiones a persistencia sean realizadas desde un mismo objeto (para que no haya conexiones por todos lados sueltas).
export class UsersDAO {
    async getby(filtro = {}) {
        return await usersModel.findOne(filtro).lean();
    }
    // aca hay que hacer todo el CRUD, pero por ahora solo vamos a hacer el create y el getby, que es lo que necesitamos para el login y el registro de usuarios. 
    async create(user = {}) {
        try {
            const newUser = await usersModel.create(user);
            // .toJSON() es un metodo de mongoose que deshidrata los objetos nativos y los vuelve objetos planos. La diferencia es que .create() no tiene metodo .lean(), entonces usamos .toJSON() directamente sobre el objeto creado:
            return newUser.toJSON();
        } catch (error) {
            throw error;
        }
    }

}
