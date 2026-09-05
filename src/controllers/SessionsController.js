import { usersDAO } from "./index.js";
import { createHashedPass } from "../utils/hash.js";

export const register = async (req, res, next) => {

    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: 'Faltan datos obligatorios: nombre, apellido, email y pass' });
    }
    //resto de validaciones pertinentes (validar email, validar pass, etc) 
    try {
        const existingUser = await usersDAO.getby({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        // uso await para esperar a que se genere el hash de la contraseña antes de crear el usuario. Esto es importante porque la creación del usuario depende de que la contraseña esté hasheada. Si no uso await, el usuario se crearía con la contraseña en texto plano, lo cual es un grave problema de seguridad.
        const hashedPass = await createHashedPass(password);

        const newUser = await usersDAO.create({ firstName, lastName, email, password: hashedPass }); //aca el pass tengo q pasarlo hasheado
        //hash: no se puede revertir (unidireccional), se usa para contraseñas
        //encryptado: se cifra y se puede revertir, se usa para mensajeria
        res.status(201).json({
            message: `Usuario registrado exitosamente para ${firstName}`,
            user: newUser // OJO ACA: antes de mostrar los datos del usuario hay que limpiarlos para no mostrar pass (o algun otro dato sensible) POR MÁS QUE ESTÉ HASHEADO. Se crea un DTO (Data Transfer Object) para eso, que es un objeto que contiene solo los datos que queremos exponer al exterior.//TODO: Esto se hace en el DAO, en el método create, donde se hace un .toJSON() y se eliminan los campos sensibles antes de devolver el objeto al controlador. El controlador no tiene que preocuparse por eso, solo recibe el objeto limpio del DAO y lo devuelve al cliente. Esto es parte de la separación de responsabilidades y de la inyección de dependencias.
        });

    } catch (error) {
        next(error);
    }
}

//todo en toda la apolicacion: reemplazar errores por middleware de errores, para que no se repita el mismo codigo en todos los controladores.
//implementar un logger para que los errores se guarden en un archivo de log y no solo se muestren en consola en el caso de autenticacion y registro de usuarios. Esto es importante para poder hacer un seguimiento de los errores y poder solucionarlos. Tambien es importante para poder auditar la aplicacion y ver si hay intentos de hackeo o de acceso no autorizado.