import { Router } from "express";
import { usersController } from "../controllers/index.js";
import { auth } from "../middlewares/auth.js";

export const router = Router();

router.get('/', usersController.getUsers)
router.get('/:id', auth, usersController.getUsersById)
router.get('/email/:email', auth, usersController.getUsersByEmail)
router.post('/register', usersController.getUsersById)