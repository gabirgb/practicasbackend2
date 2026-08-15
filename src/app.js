import express from 'express';
// lo importo con alias porque seguro tendré varios routers en mi app
import { router as productsRouter } from './routes/productsRouter.js';
import { config } from './config/config.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { logger } from './middlewares/log.js';


const PORT = 3000;
// reemplazo configuraciones harcodeadas por las del arch config:
// const PORT = config.PORT; 

const app = express();

//middlewares basicos para parsear la request del servidor
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Paso 1: la peticion entra a mi app.js y detecta q estoy solicitando una ruta que empieza con '/api/products', entonces pasa al router de productsRouter.js 
// escribo la ruta ('/api/products') desde donde quiero usar el router de productos, y a esa ruta se le concatena las rutas que definí en cada endpoint de productsRouter.js ("/", "/:id", etc)
app.use('/api/products', productsRouter); // por ej quedaria '/api/products/:id' para el endpoint de get por id

//endpoint basico para la home
// "/" -> path (del home)
// get -> metodo
// {} -> handler o "controler" de la ruta
app.get('/', (req, res) => {
    res.setHeader('Content-type', 'text/html');
    res.status(200).send('<h1>Bienvenido a mi servidor express</h1>');
});

app.get('/test', logger, (req, res) => {

    if (req.query.error) {
        throw new Error("Error de pruebas!");
    }

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json("Test ok!!");
});

app.use(errorHandler);

//pongo al serv a escuchar
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}`);
})

