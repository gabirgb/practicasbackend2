// import { UsersDTO } from "../dto/UsersDTO.js";
import jwt from "jsonwebtoken"
import { config } from "../config/config.js";

export const auth = (req, res, next) => {
    // Cuando usamos como metodo de envío los Headers, el mecanismo se llama TOKEN DE PORTADOR o "BEARER TOKEN": hay que mandarlo con la palabra reservada "bearer", ej:
    // BEARER gsdgfsfsdf.dfegwegfsdf.wegweggweg
    // auqneu tengo q quitar la palabra "bearer"
    // en convencion usar el nombre authorization para pasarnos el token en el header

    const authHeader = req.headers.authorization;

    // 1. Verificamos que el header exista
    if (!authHeader) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({ error: 'No existen usuarios autenticados' });
    }

    // 2. Separamos el formato "Bearer <token>"
    // si el token viene en el header, lo guardoen una var y elimino la palabra bearer
    // slipt() devuelve un array cortando el string por el elemento seleccioando
    const parts = authHeader.split(" ");
    const scheme = parts[0];
    const token = parts[1];

    // 3. Validamos que el esquema sea 'Bearer' y que el token realmente contenga valor
    if (scheme !== "Bearer" || !token || token.trim() === "") {
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    // 4. Verificamos el token: confirmo q el token sea válido verificándolo contra mi secret
    //jwt.verify(token, secret)
    //  Si el token es válido y no ha expirado: No devuelve true, sino que descodifica el token y devuelve el contenido (payload) que guardé cuando lo creé con jwt.sign() en sessionsController
    // Si el token es inválido, expiró o está mal formado: Lanza un error en la ejecución (excepción).
    try {
        const payload = jwt.verify(token, config.general.JWT_SECRET);

        // Como jwt.verify devolvió el objeto con los datos del usuario, esta línea guarda ese objeto en el objeto de la petición (req.user). De esta forma, las siguientes funciones/controladores que ejecuten después de este middleware podrán acceder a req.user para saber qué usuario hizo la solicitud.
        req.user = payload; // Guardamos los datos del usuario firmados en el token
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({ error: `Credenciales inválidas: ${error.message}` }); //error mesage solamente en NODE_ENV=development
    }

    next();
}