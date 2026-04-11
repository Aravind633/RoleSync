
import express from 'express';
import { register, login, getMe, logout } from './auth.controller.js';
import { protect } from '../../core/middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', getMe);

export default router;