import express from 'express';
// lo importo con alias porque seguro tendré varios routers en mi app
import { router as productsRouter } from './routes/productsRouter.js';
import { config } from './config/config.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { logger } from './middlewares/log.js';
import { auth } from './middlewares/auth.js';
import { connDB } from './config/db.js';
import { router as sessionRouter } from './routes/sessionRouter.js';
import { router as usersRouter } from './routes/usersRouter.js'
//Rutas relativas como "src/public" pueden fallar según desde qué directorio ejecute el comando node en la terminal. La forma estándar y más robusta en Node.js es generar la ruta absoluta utilizando el módulo path:
import path from 'path';
import { fileURLToPath } from 'url';

import cookieParser from 'cookie-parser';
import { verifySameOrigin } from './middlewares/verifySameOrigin.js';

const PORT = config.PORT;


//En la sintaxis antigua de Node.js (CommonJS usando require), Node.js inyectaba automáticamente __dirname y __filename en todos los archivos.
// Sin embargo, al activar ES Modules (agregando "type": "module" en tu package.json), esas variables globales desaparecen. Crear estas 2 vars (__filename y __dirname) es el estándar oficial para volver a tener acceso a la ruta del directorio actual de forma dinámica y multiplataforma.

//import.meta.url: Es una propiedad nativa de ES Modules que devuelve la ubicación del archivo actual en formato de URL web (file:///C:/proyectos/app/src/app.js)
//fileURLToPath(...): Función del módulo url de Node.js que toma esa URL y la convierte en una ruta de sistema de archivos estándar (C:\proyectos\app\src\app.js en Windows o /proyectos/app/src/app.js en Linux/Mac). 
// Resultado: __filename guarda la ruta absoluta completa hacia el archivo actual, incluyendo el nombre del archivo.
const __filename = fileURLToPath(import.meta.url);

//path.dirname(...): Función del módulo path que toma una ruta de archivo y le quita el nombre del archivo, devolviendo únicamente la carpeta contenedora.
// Resultado: __dirname guarda la ruta absoluta hacia el directorio (carpeta) donde se encuentra el archivo actual.
const __dirname = path.dirname(__filename);

const app = express();

//Para mostrar contenido estatico inicio express.static y le asigno la carpeta donde van a estar mis archivos estáticos.
//El método path.join() se encarga de concatenar las rutas de forma dinámica y multiplataforma, resolviendo correctamente los separadores de carpetas (/ en Linux/Mac y \ en Windows).
// 2. Definir la carpeta de archivos estáticos (CSS, JS cliente, imágenes, HTML plano)
//Como app.js ya está dentro de la carpeta src/, la variable __dirname apuntará a C:\mi-proyecto\src:
// Apunta a: C:\mi-proyecto\src\public
app.use(express.static(path.join(__dirname, 'public')));

//si app.js estuviera en el raiz, debería indicarle que ademas entre en src tambien:
// Apunta a: C:\mi-proyecto\src\public
// app.use(express.static(path.join(__dirname, 'src', 'public')));

// 3. Definir la carpeta de Vistas (si usas motores de plantilla como Handlebars, EJS, Pug)
// app.set('views', path.join(__dirname, 'src', 'views'));
// app.set('view engine', 'ejs'); // Ejemplo con motor EJS

//middlewares basicos para parsear la request del servidor
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Aplicar el middleware de protección contra CSRF
app.use(verifySameOrigin);


app.use('/api/sessions', sessionRouter);
app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter)

app.get('/test', auth, logger, (req, res) => {
    if (req.query.error) {
        throw new Error("Error de pruebas!");
    }

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
        payload: "Test ok!!",
        user: req.user.nombre
    });
});

app.use(errorHandler);

//pongo al serv a escuchar
const server = app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
})

connDB(config.database.MONGO_URI, config.database.DB_NAME)