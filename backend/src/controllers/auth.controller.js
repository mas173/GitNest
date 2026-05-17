import User from '../models/User.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import { sendSuccess } from '../utils/responseHandlers.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

export const register = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(new AppError('Please provide username, email and password', 400));
  }

  const lowercaseEmail = email.toLowerCase();
  const lowercaseUsername = username.toLowerCase();

  const userExists = await User.findOne({ $or: [{ email: lowercaseEmail }, { username: lowercaseUsername }] });

  if (userExists) {
    return next(new AppError('User already exists', 400));
  }

  const user = await User.create({
    username: lowercaseUsername,
    email: lowercaseEmail,
    password,
  });

  const token = generateToken(user._id);

  sendSuccess(res, 201, {
    _id: user._id,
    username: user.username,
    email: user.email,
    token,
  }, 'User registered successfully');
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide an email and password', 400));
  }

  const lowercaseEmail = email.toLowerCase();

  const user = await User.findOne({ email: lowercaseEmail }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    return next(new AppError('Invalid credentials', 401));
  }

  const token = generateToken(user._id);

  sendSuccess(res, 200, {
    _id: user._id,
    username: user.username,
    email: user.email,
    token,
  }, 'Logged in successfully');
});

export const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  sendSuccess(res, 200, user);
});
