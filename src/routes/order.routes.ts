import { Router } from 'express';
import { 
    createOrder, 
    getMyOrders, 
    getOrderById, 
    processPayment,
    getAllOrders,
    updateOrderStatus
} from '../controllers/order.controller';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';

const router = Router();
router.post('/create', verifyToken, createOrder);
router.post('/:id/pay', verifyToken, processPayment);
router.get('/my-orders', verifyToken, getMyOrders);
router.get('/:id', verifyToken, getOrderById);
router.get('/admin/all', verifyToken, isAdmin, getAllOrders);
router.put('/admin/:id/status', verifyToken, isAdmin, updateOrderStatus);

export default router;