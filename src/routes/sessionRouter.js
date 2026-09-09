import { Router } from 'express';
import { sessionsController } from '../controllers/index.js';
export const router = Router();

router.get('/current', sessionsController.getCurrentSession);
router.post('/login', sessionsController.login);
router.post('/logout', sessionsController.logout);