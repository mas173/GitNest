import express from 'express';
import {
    getUserProfile,
    updateProfile,
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
} from '../controllers/user.controller.js';
import { protect } from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import { updateProfileValidator, usernameParamValidator } from '../validators/user.validators.js';

const router = express.Router();

//Public routes
router.get('/:username', validate(usernameParamValidator), getUserProfile);
router.get('/:username/followers', validate(usernameParamValidator), getFollowers);
router.get('/:username/following', validate(usernameParamValidator), getFollowing);

// Protected routes
router.put('/profile', protect, validate(updateProfileValidator), updateProfile);
router.post('/:username/follow', protect, validate(usernameParamValidator), followUser);
router.delete('/:username/follow', protect, validate(usernameParamValidator), unfollowUser);

export default router;
