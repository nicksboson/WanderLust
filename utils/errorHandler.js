const ExpressError = require("./ExpressError");

// 404 handler - must be after all other routes
const notFoundHandler = (req, res, next) => {
    next(new ExpressError(404, 'Page not found'));
};

// Error handling middleware - must be after 404 handler
const errorHandler = (err, req, res, next) => {
    console.error(err);
    let { status = 500, message = "Something went wrong" } = err;
    
    // Handle Joi validation errors
    if (err.isJoi) {
        status = 400;
        message = err.details.map(detail => detail.message).join(', ');
    }
    
    // Handle MongoDB errors
    if (err.name === 'CastError') {
        status = 400;
        message = 'Invalid ID format';
    }
    
    // Handle MongoDB duplicate key errors
    if (err.code === 11000) {
        status = 400;
        message = 'Duplicate field value entered';
    }

    // Handle MongoDB connection errors
    if (err.name === 'MongoServerError') {
        status = 500;
        message = 'Database error occurred';
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
        status = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    res.status(status).render('listings/error', { err: { status, message } });
};

module.exports = { notFoundHandler, errorHandler }; 