import { sanitizeInput } from "../utils/sanitizer.js";

// creo la clase
export class ProductsController {
    // Paso 5: creo el constructor (método especial con el que luego se INSTANCIAN los objetos de dicha clase) para poder importar el ProductsDAO.js
    // Es decir, tengo esta clase "ProductsController" que cuando la instancie ("new ProductsController()", lo hago en index.js)debo mandarle si o si los datos persistentes
    constructor(productsDAO) {
        this.productsDAO = productsDAO; //el this se refiere al objeto actual.
    }
    // creo los métodos
    // Paso 3: el controlador recibe la peticion y envía la respuesta, y hace lo que tenga que hacer (en este caso devolver un listado de productos)
    getProducts = async (req, res) => {

        try {
            // Paso 6: llamo al metodo get del ProductsDAO.js para obtener el listado de productos
            let products = await this.productsDAO.get();

            res.setHeader('Content-type', 'application/json');
            res.status(200).json({ message: 'Listado de productos', products });

        } catch (error) {

            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `Internal server error` });
        }
    }

    getProductsById = async (req, res) => {

        try {

            let producto = `Producto ${req.params.id}`; //muestro el id que me llega por params desde la ruta /api/products/:id

            res.setHeader('Content-type', 'application/json');
            res.status(200).json({ producto });
        } catch (error) {

            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `Internal server error` });
        }
    }

    createProduct = async (req, res, next) => {
        try {

            //1. desestructuro propiedades para hacer la validacion de c/u, uso LET para poder reasignarles valor luego de la sanitizacion
            let { code, title, description, category, color, thumbnail, price, stock, status = true } = req.body;

            // Sanitizo manualmente
            code = sanitizeInput(code);
            title = sanitizeInput(title);
            description = sanitizeInput(description);
            category = sanitizeInput(category);
            color = sanitizeInput(color);
            thumbnail = sanitizeInput(thumbnail);

            //2. valido campos obligatorios
            if (!code || !title || !category || !price || !stock) {
                res.setHeader('Content-type', 'application/json');
                return res.status(400).json({
                    error: 'Faltan campos obligatorios (code/ title/ category/ price/ stock)'
                });
            }
            //3. Valido tipo de datos y errores logicos
            if (typeof price !== 'number' || typeof stock !== 'number' || stock < 0) {
                res.setHeader('Content-type', 'application/json');
                return res.status(400).json({
                    error: 'Valores inválidos: El precio y stock deben ser números, y el stock un no puede ser negativo'
                });
            }

            // 4. Crear el producto enviando solo los campos desestructurados y limpios: Al construir productData explícitamente, evito que el cliente inyecte propiedades no deseadas que vengan en el req.body.
            const productData = { code, title, description, category, color, thumbnail, price, stock, status };

            let newProduct = await this.productsDAO.create(productData);
            res.setHeader('Content-type', 'application/json');
            return res.status(201).json({ status: 'success', payload: newProduct });

        } catch (error) {
            // 👇 Pasa el error directamente al middleware errorHandler
            next(error);

        }
    }


}