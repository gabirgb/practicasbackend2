import { sanitizeInput } from "../utils/sanitizer.js";
import { VALID_PRODUCT_STATUSES } from "../constants/productsConstants.js";
import { BadRequestError, NotFoundError } from "../utils/CustomError.js";

// creo la clase
export class ProductServices {
    constructor(productsDAO) {
        this.productsDAO = productsDAO; //el this se refiere al objeto actual.
    }

    getAllProducts = async (queryParams) => {
        const products = await this.productsDAO.getAll(queryParams);
        if (!products || products.length === 0) {
            throw new NotFoundError('No hay resultados que coincidan con sus criterios de busqueda.');
        }
        return products;
    }

    getProductById = async (id) => {
        const product = await this.productsDAO.getById(id);
        if (!product || product.length === 0) {
            throw new NotFoundError('No se encontró el evento con id ${id}');
        }
        return product;
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
            throw new BadRequestError('Faltan datos obligatorios');
        }

        //3. Valido tipo de datos y errores logicos
        if (typeof price !== 'number' || typeof stock !== 'number' || stock < 0) {
            throw new BadRequestError('El precio y el stock deben ser números. El stock no pueden ser negativo');
        }

        if (status && !VALID_PRODUCT_STATUSES.includes(status.toLowerCase())) {
            throw new BadRequestError(`El estado ${status} no es válido. Opciones permitidas: ${VALID_PRODUCT_STATUSES.join(', ')}`);
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