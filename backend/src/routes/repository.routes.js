import express from 'express';
import {
    createRepository,
    getRepository,
    getUserRepositories,
    updateRepository,
    deleteRepository,
    starRepository,
    forkRepository,
} from '../controllers/repository.controller.js';
import { protect } from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import {
    createRepositoryValidator,
    updateRepositoryValidator,
} from '../validators/repository.validators.js';

const router = express.Router();

//Public routes
router.get('/:username', getUserRepositories);
router.get('/:username/:reponame', getRepository);

//Protected routes
router.post('/', protect, validate(createRepositoryValidator), createRepository);
router.put('/:username/:reponame', protect, validate(updateRepositoryValidator), updateRepository);
router.delete('/:username/:reponame', protect, deleteRepository);
router.post('/:username/:reponame/star', protect, starRepository);
router.post('/:username/:reponame/fork', protect, forkRepository);

export default router;