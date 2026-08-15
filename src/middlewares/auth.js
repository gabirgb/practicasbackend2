// middleware simulando autenticacion con fines pedagogicos
// Siempre que validemos algo vamos a preguntar por la ocurrencia del error (no por la existencia de acierto) porque de esta forma dentro del IF me queda indicar qué hacer en caso de error (que es mucho más corto) y ejecutar un return para detener la ejecución del código.
// de la forma inversa (o sea, validar que los datos sean correctos) me lleva a escribir dentro del if todo lo que va a pasar a posterior, y eso por lo general deriva en que tengo un choclo de código anidado larguísimo, que me juega en contra a la hora de distribuir las responsabilidades entre las capas del código.

import { config } from "../config/config.js";

export const auth = (req, res, next) => {

    if (req.query.user != "admin" || req.query.password != config.general.SECRET) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({ error: `Credenciales inválidas` });
    }
    next();
}

// http://localhost:3000/api/products?user=admin&password=Coder123