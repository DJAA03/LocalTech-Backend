import { Router } from 'express';
import { 
    updateUserProfile, 
    changePassword,
    getWishlist,
    toggleWishlist
} from '../controllers/user.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();
router.put('/profile', verifyToken, updateUserProfile);
router.put('/change-password', verifyToken, changePassword);
router.get('/wishlist', verifyToken, getWishlist);
router.post('/wishlist/toggle', verifyToken, toggleWishlist);

export default router;