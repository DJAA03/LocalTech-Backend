import { Router } from 'express';
import { 
    generateDescription, 
    chatWithBot, 
    generateAllEmbeddings, 
    semanticSearch 
} from '../controllers/ia.controller';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.post('/generate-description', verifyToken, isAdmin, generateDescription);
router.post('/chat', chatWithBot);
router.post('/generate-all-embeddings', verifyToken, isAdmin, generateAllEmbeddings);
router.get('/search', semanticSearch);

export default router;