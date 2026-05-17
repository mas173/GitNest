import { body } from 'express-validator';

export const registerValidator = [
    body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),

    body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),

    body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6}).withMessage('Password must be at least 6 characters'),
];

export const loginValidator = [
    body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),

    body('password')
    .notEmpty().withMessage('Password is required'),
];