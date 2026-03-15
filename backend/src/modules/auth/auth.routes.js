// import express from 'express';
// import { register, login, refresh, logout } from './auth.controller.js';
// import { protect, restrictTo } from '../../core/middlewares/auth.middleware.js';
// import { register, login, getMe } from './auth.controller.js';

// const router = express.Router();

// router.post('/register', register);
// router.post('/login', login);
// router.post('/refresh', refresh);
// router.post('/logout', logout);

// // Example of a protected route using RBAC:
// router.get('/admin-only', protect, restrictTo('admin'), (req, res) => {
//   res.status(200).json({ status: 'success', message: 'Welcome Admin!' });
// });
// router.get('/me', protect, getMe);

// export default router;

import express from 'express';
import { register, login, getMe } from './auth.controller.js';
import { protect } from '../../core/middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

export default router;