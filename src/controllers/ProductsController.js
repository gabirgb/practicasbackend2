// creo la clase
export class ProductsController {
    // Paso 5: creo el constructor (método especial con el que luego se INSTANCIAN los objetos de dicha clase) para poder importar el ProductsDAO.js
    // Es decir, tengo esta clase "ProductsController" que cuando la instancie ("new ProductsController()", lo hago en index.js)debo mandarle si o si los datos persistentes
    constructor(productServices) {
        this.productServices = productServices; //el this se refiere al objeto actual.
    }
    // creo los métodos
    // Paso 3: el controlador recibe la peticion y envía la respuesta, y hace lo que tenga que hacer (en este caso devolver un listado de productos)
    getProducts = async (req, res, next) => {

        try {
            // Paso 6: llamo al metodo get del ProductsDAO.js para obtener el listado de productos
            let products = await this.productServices.getAllProducts();

            if (!products || products.length === 0) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(404).json({
                    status: `error`,
                    message: 'No hay resultados que coincidan con sus criterios de busqueda.'
                });
            }

            res.setHeader('Content-type', 'application/json');
            res.status(200).json({
                status: 'success',
                payload: products
            });

        } catch (error) {
            next(error)
        }
    }

    getProductById = async (req, res, next) => {
        try {

            let { id } = req.params;
            const product = await this.productServices.getProductsById(id);

            if (!product) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(404).json({
                    status: 'error',
                    message: `No se encontró el evento con id ${id}`
                });
            }

            res.setHeader('Content-type', 'application/json');
            res.status(200).json({
                status: 'success',
                payload: product
            });
        } catch (error) {
            next(error)
        }
    }

    createProduct = async (req, res, next) => {
        try {
            const newProduct = await this.productsServices.createProduct(req.body);
            res.setHeader('Content-type', 'application/json');
            return res.status(201).json({
                status: 'success',
                payload: newProduct
            });

        } catch (error) {
            // Si el servicio lanzó un error de validacion (statusCode 400)
            if (error.satstusCode) {
                return res.status(error.statusCode).json({
                    status: 'error',
                    message: error.message
                });
            }
            // Si no, paso directamente al middleware errorHandler
            next(error);

        }
    }


}