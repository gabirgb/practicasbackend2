// INYECCIÓN DE DEPENDENCIAS 
// La idea de este index.js es ilustrar el concepto de "inyección de dependencias", en el que en lugar de crear instancias dentro de los elementos que las usan se generan en un index aparte (por ejemplo como hacemos abajo, instanciando una clase y luego pasándosela de arg a la instancia de la segunda clase). Esto sirve mucho sobre todo a la hora de testeo con servicios, ddbb alternativas, migraciones, etc. Además favorece el trabajo sincrónico en equipo, la edición y el debugg.

// La idea es ir separando las responsabilidades: los controladores son clases que solamente se encargan de la lógica del negocio (fijate que ni siquiera instancio allí el DAO porque este se encarga de datos, y el controlador solo necesita que le pase un arg para poder resolver la peti). Tambien instancio desde acá las clases de cada controlador que creo, de esa forma desde las rutas siempre importo desde este índice los controladores de cualquier entidad.

// La inyección de dependencias tambien suele hacerce con las capas de servicios y repositorio.
import { ProductsController } from "./ProductsController.js";
import { ProductsDAO } from "../dao/ProductsDAO.js";

// Paso 7: Cuando instancio la clase ProductsController definí (al crearla en ProductsControler.js) que le tengo que pasar un DAO funcional. Entonces antes de instanciar la clase debo instanciar el DAO para poder pasarlo como arg.
export const productsDAO = new ProductsDAO();
export const productsController = new ProductsController(productsDAO);
