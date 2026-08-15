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

}