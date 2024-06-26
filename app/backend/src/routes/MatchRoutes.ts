import { Router } from 'express';
import MatchController from '../controllers/MatchController';
import AuthMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.get('/', MatchController.getMatches);
router.patch('/:id/finish', AuthMiddleware.validateToken, MatchController.finishMatch);
router.patch('/:id', AuthMiddleware.validateToken, MatchController.updateMatch);
router.post('/', AuthMiddleware.validateToken, MatchController.createMatch);

export default router;
