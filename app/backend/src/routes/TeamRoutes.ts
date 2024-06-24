import { Router } from 'express';
import TeamController from '../controllers/TeamController';

const router = Router();

router.get('/', TeamController.getTeams);
router.get('/:id', TeamController.getTeam);

export default router;
