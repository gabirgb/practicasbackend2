import { Router } from "express";
import { usersController } from "../controllers/index.js";
import { auth } from "../middlewares/auth.js";
import passport from "passport";

export const router = Router();

router.get('/', usersController.getUsers)
router.get('/:id', auth, usersController.getUsersById)
router.get('/email/:email', auth, usersController.getUsersByEmail)
router.post(
    '/register',
    passport.authenticate( // recordar: si el authenticate sale ok passport guarda el return en el req.user
        "registro",
        {
            session: false,
            failureRedirect: "/error"
        }
    ),
    usersController.createUser)
