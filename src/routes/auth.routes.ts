import { Router } from 'express';
import { register, login, registerAdmin } from '../controllers/auth.controller';

const router = Router();
router.post('/register', register);
router.post('/register-admin', registerAdmin);
router.post('/login', login);

export default router;