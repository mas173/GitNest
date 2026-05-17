const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue)[0];
        message = `${field} already exists`;
    }

    if(err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(e => e.message).join(', ');
    }

    if(err.name === 'CastError'){
        statusCode = 404;
        message = `Resource not found`;
    }

    if(err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Session expired, please log in again';
    }

    if(err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token, please log in again';
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

export default errorHandler;