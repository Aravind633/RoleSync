import jwt from 'jsonwebtoken';
import { User } from '../../modules/users/user.model.js';
import { AppError } from '../errors/AppError.js';
import { env } from '../../config/env.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(new AppError('You are not logged in.', 401));
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return next(new AppError('User no longer exists.', 401));
    }

    req.user = currentUser;
    next();
  } catch (error) {
    next(new AppError('Invalid session. Please log in again.', 401));
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission', 403));
    }
    next();
  };
};