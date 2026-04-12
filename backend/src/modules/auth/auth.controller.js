import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { User } from '../users/user.model.js';
import { Profile } from '../users/profile.model.js';
import { AppError } from '../../core/errors/AppError.js';
import { logger } from '../../core/logger/index.js';

const generateTokens = (id) => {
  const accessToken = jwt.sign({ id }, env.JWT_SECRET, { expiresIn: '15m' }); // Short-lived
  const refreshToken = jwt.sign({ id }, env.JWT_SECRET, { expiresIn: '7d' }); // Long-lived
  return { accessToken, refreshToken };
};

const sendTokenResponse = async (user, statusCode, res) => {
  const { accessToken, refreshToken } = generateTokens(user._id);

  // Save refresh token to database for rotation/revocation
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Set HTTP-Only Cookie
  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'lax' : 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    accessToken,
    data: { user }
  });
};

export const register = async (req, res, next) => {
  try {
    const { email, password, role, firstName, lastName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return next(new AppError('Email already in use', 400));

    const newUser = await User.create({ email, password, role: role || 'candidate' });
    await Profile.create({ user: newUser._id, firstName, lastName });

    logger.info(` New ${newUser.role} registered: ${email}`);
    await sendTokenResponse(newUser, 201, res);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return next(new AppError('Provide email and password', 400));

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    logger.info(`User logged in: ${email}`);
    await sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.jwt;
    if (!refreshToken) return next(new AppError('Not logged in. Please log in again.', 401));

    // Verify token
    const decoded = jwt.verify(refreshToken, env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return next(new AppError('Invalid refresh token. Please log in again.', 401));
    }

    // Issue new tokens (Rotation)
    await sendTokenResponse(user, 200, res);
  } catch (error) {
    next(new AppError('Invalid or expired token', 401));
  }
};

export const logout = async (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};
export const getMe = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(200).json({ status: 'success', data: { user: null } });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
      return res.status(200).json({ status: 'success', data: { user: null } });
    }

    const currentUser = await User.findById(decoded.id);

    res.status(200).json({
      status: 'success',
      data: {
        user: currentUser || null
      }
    });
  } catch (error) {
    next(error);
  }
};