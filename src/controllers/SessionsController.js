import { usersDAO } from "./index.js";
import { createHashedPass, comparePass } from "../utils/hash.js";
import { UsersDTO } from "../dto/UsersDTO.js";

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
            user: new UsersDTO(user) // OJO ACA: antes de mostrar los datos del usuario hay que limpiarlos para no mostrar pass (o algun otro dato sensible) POR MÁS QUE ESTÉ HASHEADO. Se crea un DTO (Data Transfer Object) para eso, que es un objeto que contiene solo los datos que queremos exponer al exterior. Esto se hace en el DAO, en el método create, donde se hace un .toJSON() y se eliminan los campos sensibles antes de devolver el objeto al controlador. El controlador no tiene que preocuparse por eso, solo recibe el objeto limpio del DAO y lo devuelve al cliente. Esto es parte de la separación de responsabilidades y de la inyección de dependencias.
        });

    } catch (error) {
        next(error);
    }
}

//todo en toda la apolicacion: reemplazar errores por middleware de errores, para que no se repita el mismo codigo en todos los controladores.
//implementar un logger para que los errores se guarden en un archivo de log y no solo se muestren en consola en el caso de autenticacion y registro de usuarios. Esto es importante para poder hacer un seguimiento de los errores y poder solucionarlos. Tambien es importante para poder auditar la aplicacion y ver si hay intentos de hackeo o de acceso no autorizado.

export const login = async (req, res, next) => {
    let { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Faltan datos obligatorios: email y pass' });
    }
    try {
        const user = await usersDAO.getby({ email });
        if (!user) {
            // err 401 - no poner "usuario no encontrado" porque eso le da info al atacante de que el email no existe, mejor poner "credenciales incorrectas" o mensajes genericos similares
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Acá va la lógica para comparar la contraseña ingresada con la hasheada
        if (!await comparePass(password, user.password)) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Acá es donde uso el DTO solo para mostrar los campos que quiero filtrar al exterior (y me lo devuelve con las transformaciones que yo le haya hecho en el dto, por ej en este le puse los campos en castellano y omiti pass). Si pongo solamente (message:"", user), me devuelve el objeto original con todos los datos
        res.status(200).json({ message: `Usuario ${user.firstName} logueado exitosamente`, user: new UsersDTO(user) });

    } catch (error) {
        next(error);
    }
}