// Paso 4: Creo la capa de acceso a los datos (aunque no haya persistencia mediante una db) porque no es buena practica tener todos los prod en el controler, deberian hacerse mediante el patron de diseño DAO que nos dice que todos los datos deben estar en estructura aparte. 
// DAO se encarga solamente de la interacción con la persistencia de datos (por ahora hasta q lleguemos a la unidad será un array de productos)

import { productModel } from "./models/productModel.js";

export class ProductsDAO {
    async get(filtro = {}) {
        // el lean() es un metodo de mongoose que deshidrata los objetos nativos q vienen de un find de mongoose, que vienen con un monton de propiedades ocultas medio raras que a algunas dependencias no le gusta (como json Web Token). Deshidrata los onjetos (los transforma en objetos "planos" de javascript) 
        return await productModel.find().lean();
    }
    async create(product = {}) {
        try {
            const newProduct = await productModel.create(product);
            return newProduct.toJSON();
        } catch (error) {
            throw error;
        }
    }
}

