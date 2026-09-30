import { Router } from 'express';
import { sessionsController } from '../controllers/SessionsController.js';
import { passportCall } from '../middlewares/passportCall.js';

export const router = Router();

// uso el middleware de passportCall que creé para checkear si hay errores como cambios en el toke, cierre de sesiones, etc...
router.get('/current', passportCall('current'), sessionsController.login);
router.post('/login', passportCall('login'), sessionsController.login);
router.get('/logout', sessionsController.logout);
