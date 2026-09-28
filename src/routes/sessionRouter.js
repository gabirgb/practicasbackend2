import { Router } from 'express';
import { sessionsController } from '../controllers/SessionsController.js';
import passport from 'passport';

export const router = Router();


router.get(
    '/current',
    passport.authenticate(
        "current",
        {
            session: false,
            failureRedirect: "/error"
        }
    ),
    sessionsController.getCurrentSession);


//router.post('/login', sessionsController.login);
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