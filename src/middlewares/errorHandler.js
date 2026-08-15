// la idea es que cuando implementemos corretamente el manejo de errores, dependiendo del tipo de error mostremos un msje diferente. Por ahora solo ponemos 1.
export const errorHandler = (err, req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ error: `Internal server error` });
}