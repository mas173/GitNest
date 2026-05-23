import { body } from 'express-validator';

export const createRepositoryValidator = [
    body('name')
    .trim()
    .notEmpty().withMessage('Repository name is required')
    .isLength({ min: 1, max: 100 }).withMessage('Repository name must be between 1 and 100 characters')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Repository name can only contain letters, numbers, hyphens and underscores'),

    body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),

    body('visibility')
    .optional()
    .isIn([ 'public', 'private']).withMessage('Visibility must be either public or private'),

    body('topics')
    .optional()
    .isArray().withMessage('Topics must be an array')
    .custom((topics) => topics.every((t) => typeof t === 'string'))
    .withMessage('Each topic must be a string'),
];

export const updateRepositoryValidator = [
    body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),

    body('visibility')
    .optional()
    .isIn(['public', 'private']).withMessage('Visibility must be either public or private'),

    body('topics')
    .optional()
    .isArray().withMessage('Topics must be an array')
    .custom((topics) => topics.every((t) => typeof t === 'string'))
    .withMessage('Each topic must be a string'),

    body('defaultBranch')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Default branch name must not exceed 100 characters'),
];