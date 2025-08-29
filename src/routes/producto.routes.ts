import { Router } from 'express';
import { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    getFeaturedProducts,
    getRecomendaciones,
    predictiveSearch 
} from '../controllers/producto.controller';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';

const router = Router();
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/predictive-search', predictiveSearch);
router.get('/:id', getProductById);
router.get('/:id/recomendaciones', getRecomendaciones);
router.post('/', verifyToken, isAdmin, createProduct);
router.put('/:id', verifyToken, isAdmin, updateProduct);
router.delete('/:id', verifyToken, isAdmin, deleteProduct);

export default router;
