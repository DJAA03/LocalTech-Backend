import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';

const router = Router();
router.get('/', verifyToken, isAdmin, getDashboardStats);

export default router;