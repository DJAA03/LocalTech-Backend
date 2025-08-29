import { Router } from 'express';
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from '../controllers/categoria.controller';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';

const router = Router();
router.get('/', getCategorias);
router.post('/', verifyToken, isAdmin, createCategoria);
router.put('/:id', verifyToken, isAdmin, updateCategoria);
router.delete('/:id', verifyToken, isAdmin, deleteCategoria);

export default router;