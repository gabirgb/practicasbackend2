import { Router } from "express";
// importo el controller para poder usar sus metodos en las rutas
import { productsController } from "../controllers/index.js";
import { logger } from "../middlewares/log.js";
import { auth } from "../middlewares/auth.js";
//inicializo el router Y LO EXPORTO para poder usarlo en app.js
export const router = Router();

// router.use(logger);
router.use(auth);
// Paso 2: nota que es un get y entonces lo deriva al controler 
//empiezo a generar las rutas
router.get('/', productsController.getProducts); // aca le paso el metodo de la clase que cree en productsController.js

router.get('/:id', productsController.getProductsById);


router.post('/', productsController.createProduct);

