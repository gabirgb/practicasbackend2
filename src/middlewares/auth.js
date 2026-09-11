export const auth = (req, res, next) => {
    if (!req.session.user) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({ error: `No existen usuarios autenticados` });
    }

    next();
    //ojo al probar la autenticacion que al guardar cambios se reinicia automaticamente el serv con nodemon y pierdo la sesion iniciada anteriormente en postman
}