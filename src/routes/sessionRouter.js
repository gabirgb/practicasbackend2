import { Router } from 'express';
import { sessionsController } from '../controllers/index.js';
import { auth } from '../middlewares/auth.js';
import passport from 'passport';

export const router = Router();


router.get('/current', auth, sessionsController.getCurrentSession);

// router.post('/login', sessionsController.login);
router.post(
    '/login',
    passport.authenticate(
        "login",
        {
            session: false,
            failureRedirect: "/error"
        }
    ),
    sessionsController.login);


router.get('/logout', sessionsController.logout);