import { sanitizeInput } from "../utils/sanitizer.js";
import { VALID_PRODUCT_STATUSES } from "../constants/productsConstants.js";

// creo la clase
export class ProductServices {
    constructor(productsDAO) {
        this.productsDAO = productsDAO; //el this se refiere al objeto actual.
    }

    getAllProducts = async (queryParams) => {
        return await this.productsDAO.get(queryParams);
    }

    getProductById = async (id) => {
        return await this.productsDAO.getById(id);
    }

    createProduct = async (rawEventData) => {
        //1. desestructuro propiedades para hacer la validacion de c/u, uso LET para poder reasignarles valor luego de la sanitizacion
        let { code, title, description, color, category, thumbnail, price, stock, status } = rawEventData;

        // Sanitizo manualmente
        code = sanitizeInput(code);
        title = sanitizeInput(title);
        description = sanitizeInput(description);
        color = sanitizeInput(color);
        category = sanitizeInput(category);
        thumbnail = sanitizeInput(thumbnail);
        status = sanitizeInput(status);

        //2. valido campos obligatorios
        if (!code || !title || !description || !category || !price || !stock) {
            const error = new Error('Faltan campos obligatorios (code/ title/ description/ category/ category/ price/ stock)');
            error.statusCode = 400;
            throw error;
        }

        //3. Valido tipo de datos y errores logicos
        if (typeof price !== 'number' || typeof stock !== 'number' || stock < 0) {
            const error = new Error('Valores inválidos: El precio y el stock deben ser números. El stock no pueden ser negativo');
            error.statusCode = 400;
            throw error;
        }

        if (status && !VALID_PRODUCT_STATUSES.includes(status.toLowerCase())) {
            const error = new Error(`El estado ${status} no es válido. Opciones permitidas: ${VALID_PRODUCT_STATUSES.join(', ')}`);
            error.statusCode = 400;
            throw error;
        }



        // 5. Crear el evento enviando solo los campos desestructurados y limpios: Al construir EventData explícitamente, evito que el cliente inyecte propiedades no deseadas que vengan en el req.body.
        //Además, creo el date solamente si el usuario asignó fecha al evento
        // 5. Crear el objeto eventData limpio
        const cleanEventData = {
            code,
            title,
            description,
            color,
            category,
            thumbnail,
            price,
            stock,
            status
        };

        return await this.productsDAO.create(cleanEventData);

    }
}