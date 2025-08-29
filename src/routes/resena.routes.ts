import { Router } from 'express';
import { getResenasPorProducto, createResena } from '../controllers/resena.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();
router.get('/:productId', getResenasPorProducto);
router.post('/:productId', verifyToken, createResena);

export default router;