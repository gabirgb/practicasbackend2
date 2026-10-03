import { Router } from "express";
import { usersController } from "../controllers/index.js";
import { passportCall } from "../middlewares/passportCall.js";

export const router = Router();

router.get('/', usersController.getUsers)
router.get('/:id', usersController.getUsersById)
router.get('/email/:email', usersController.getUsersByEmail)
router.post('/register', passportCall('registro'), usersController.createUser);