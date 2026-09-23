import { Router } from 'express';
import { sessionsController } from '../controllers/index.js';
import { auth } from '../middlewares/auth.js';
export const router = Router();

router.get('/current', auth, sessionsController.getCurrentSession);
router.post('/login', sessionsController.login);
router.post('/logout', sessionsController.logout);