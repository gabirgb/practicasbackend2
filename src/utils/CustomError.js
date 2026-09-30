// Genero mi propia clase para lanzar errores.
/*La clase CustomError funciona como una plantilla para crear errores personalizados en tu aplicación, permitiéndote agregar información útil (como el código HTTP o si es un error esperado) que la clase Error nativa de JavaScript no trae por defecto. Esto permite que Node.js reconozca los errores personalizados dentro de bloques try/catch y en los middlewares de Express, manteniendo el comportamiento estándar de un error. */

//hereda todas las propiedades y métodos de la clase Error
export class CustomError extends Error {

    //El constructor define qué información recibirá el error al momento de crearlo con new CustomError(...) y los valores por defecto
    constructor(message = 'Ocurrió un error inesperado', statusCode = 500, errorType = 'InternalError', details = null) {

        // La función de super(...) es llamar al constructor de la clase padre (Error) para que construya la base del objeto.
        //siempre que haya un EXTENDS, la primera línea ejecutable del constructor DEBE ser super(), lleve o no lleve variables adentro.
        super(message);

        //asignacion de propiedades personalizadas
        this.statusCode = statusCode;
        this.errorType = errorType;
        this.details = details;
        this.isOperational = true; // Identifica que es un error esperado/controlado por la app

        // Captura el stack trace limpio omitiendo el constructor de esta clase
        Error.captureStackTrace(this, this.constructor);
    }
}

// FORMA DE USO
// throw new CustomError('El email ya existe', 409, 'ConflictError');


// Opcional: Clases hijas específicas para hacer la llamada aún más breve. Su objetivo es evitar escribir los mismos parámetros una y otra vez cada vez que lanzo un minmo error.
/*
Por ejemplo si uso mi clase CustomError(), debería recordar y escribir el código HTTP y el tipo de error cada vez:
throw new CustomError('El formato de email no es válido', 400, 'BadRequest', validationErrors);
throw new CustomError('El email ya existe', 409, 'ConflictError');
throw new CustomError('Usuario no encontrado', 404, 'NotFoundError');
*/

/*
En cambio usando las clases hijas, en el momento de llamarlas el código queda mucho más limpio, declarativo y sin riesgo de equivocarme en el código HTTP:
throw new BadRequestError('El formato de email no es válido', validationErrors);
throw new ConflictError('El email ya existe');
throw new NotFoundError('Usuario no encontrado');
*/
// 2. Clases Hijas Especificas
export class BadRequestError extends CustomError {
    constructor(message = 'Los datos enviados son inválidos', details = null) {
        super(message, 400, 'BadRequest', details);
    }
}

export class UnauthorizedError extends CustomError {
    constructor(message = 'No estás autenticado') {
        super(message, 401, 'Unauthorized');
    }
}

export class ForbiddenError extends CustomError {
    constructor(message = 'No tienes permisos para realizar esta acción') {
        super(message, 403, 'Forbidden');
    }
}

export class NotFoundError extends CustomError {
    constructor(message = 'Recurso no encontrado') {
        super(message, 404, 'NotFound');
    }
}

export class ConflictError extends CustomError {
    constructor(message = 'Conflicto con un recurso existente') {
        super(message, 409, 'Conflict');
    }
}

/*
¿Cómo decidir qué error lanzar?
¿De quién es la culpa de que este proceso se haya detenido?
- CLIENTE O USUARIO (4xx):
¿Se equivocó escribiendo o se olvido datos obligatorios? badRequestError (400)
¿No inició sesión?  UnauthorizedError (401)
¿No tiene permisoS suficientes? ForbiddenError (403)
¿Buscó algo que no existe? NotFoundError (404)
¿Quiso registrar un dato que ya existe y es unique (email, id, dni, etc)? ConflictError (409)

- SISTEMA O SERVIDOR (5xx):
¿Se cayó la BD, falló el envío de mails o falló la red? error $500 o InternalServerError.

*/

// Ecosistema del manejo de errores:
// middlewares/errorHandler.js
// passportCall.js - es un middleware que creo para encapsular la lógica que trabaja en el rutedor al ejecutar los "return done" exitosos. aalí tambien capturo los posibles errores como fallas en la verificacion del token