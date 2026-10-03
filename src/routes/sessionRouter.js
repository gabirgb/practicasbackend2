import { Router } from 'express';
import { sessionsController } from '../controllers/SessionsController.js';
import passport from 'passport';
import { passportCall } from '../middlewares/passportCall.js';
import { config } from '../config/config.js';

export const router = Router();

// uso el middleware de passportCall que creé para checkear si hay errores como cambios en el toke, cierre de sesiones, etc...
router.get('/current', passportCall('current'), sessionsController.getCurrentSession);
router.post('/login', passportCall('login'), sessionsController.login);

// GitHub Apps OAuth
// 1. Redirección: passport.authenticate directo (sin scope en la llamada)
router.get('/login/github', passport.authenticate('github', { session: false, failureRedirect: '/login' }));

// 2. Callback: passportCall para procesar el resultado de la estrategia
router.get(config.github.CALLBACK_PATH, passportCall('github', { failureRedirect: '/' }), sessionsController.loginGithub);

router.get('/logout', sessionsController.logout);