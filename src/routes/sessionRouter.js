import { Router } from 'express';
import { register } from '../controllers/SessionsController.js';
export const router = Router();

router.post('/register', register);