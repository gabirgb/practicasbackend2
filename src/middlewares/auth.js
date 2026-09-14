import { UsersDTO } from "../dto/UsersDTO.js";
export const auth = (req, res, next) => {
    if (!req.session.user) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({ error: `No existen usuarios autenticados` });
    }

    // me guardo al usuario no se para que porque deberia usar el DTO pero me sirve para cuando desde un endpoint de productos quiero tb pasar dats del usuario que lo esta haciendo... 
    req.user = req.session.user;

    next();
}