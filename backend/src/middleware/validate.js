import { validationResult } from 'express-validator';
import AppError from '../utils/AppError.js';

const validate = (validations) => {
    return async (req, res, next) => {
        for (const validation of validations) {
            await validation.run(req);
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const message = errors.array().map(e => e.msg).join(', ');
            return next(new AppError(message, 400));
        }

        next();
    };
};

export default validate;