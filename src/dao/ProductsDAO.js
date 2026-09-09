// Paso 4: Creo la capa de acceso a los datos (aunque no haya persistencia mediante una db) porque no es buena practica tener todos los prod en el controler, deberian hacerse mediante el patron de diseño DAO que nos dice que todos los datos deben estar en estructura aparte. 
// DAO se encarga solamente de la interacción con la persistencia de datos (por ahora hasta q lleguemos a la unidad será un array de productos)

import { productModel } from "../models/productModel.js";

export class ProductsDAO {
    async get(queryOptions = {}) {
        const { title, description, category, color, thumbnail, price, stock, status } = queryOptions;
        // creo un objeto vacio donde voy a ir armando la consulta, donde cada propiedad será un parametro de busqueda configurado
        const mongoQuery = {};

        // 1. Búsqueda por título/ artista (insensible a mayúsculas/minúsculas y parcial)
        if (title) {
            mongoQuery.title = { $regex: title, $options: 'i' };
        }

        if (category) {
            mongoQuery.category = { $regex: artist, $options: 'i' };
        }

        // 3. Filtro opcional por estado
        if (status) {
            mongoQuery.status = status;
        }

        return await productModel.find(mongoQuery).lean();
    }

    // Busca un producto por su ID de MongoDB
    async getById(id) {
        return await productModel.findById(id).lean();
    }

    // creamos un producto
    async create(product = {}) {
        const newProduct = await productModel.create(product);
        return newProduct.toJSON();
    }
}

