import { Router } from 'express';
import UserController from '../controllers/UserController';
import AuthMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.post('/', AuthMiddleware.validateFields, UserController.login);
router.get('/role', AuthMiddleware.validateToken, UserController.getUserRole);

export default router;
