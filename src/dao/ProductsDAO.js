// Paso 4: Creo la capa de acceso a los datos (aunque no haya persistencia mediante una db) porque no es buena practica tener todos los prod en el controler, deberian hacerse mediante el patron de diseño DAO que nos dice que todos los datos deben estar en estructura aparte. 
// DAO se encarga solamente de la interacción con la persistencia de datos (por ahora hasta q lleguemos a la unidad será un array de productos)

let productos = [
    { id: 1, code: 'PROD001', name: 'Producto 1', stock: 10, price: 10.99 },
    { id: 2, code: 'PROD002', name: 'Producto 2', stock: 5, price: 19.99 },
    { id: 3, code: 'PROD003', name: 'Producto 3', stock: 0, price: 5.99 },
    { id: 4, code: 'PROD004', name: 'Producto 4', stock: 20, price: 15.99 },
    { id: 5, code: 'PROD005', name: 'Producto 5', stock: 8, price: 12.99 },
    { id: 6, code: 'PROD006', name: 'Producto 6', stock: 3, price: 9.99 },
    { id: 7, code: 'PROD007', name: 'Producto 7', stock: 15, price: 7.99 },
    { id: 8, code: 'PROD008', name: 'Producto 8', stock: 0, price: 14.99 },
    { id: 9, code: 'PROD009', name: 'Producto 9', stock: 12, price: 11.99 },
    { id: 10, code: 'PROD010', name: 'Producto 10', stock: 6, price: 8.99 }
]

// exporto la clase para poder instanciarla en ProductsController.js y pasarle los datos
export class ProductsDAO {
    async get() {
        return productos;
    }
}