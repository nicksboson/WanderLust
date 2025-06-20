const ExpressError = require("./ExpressError");

// 404 handler - must be after all other routes
const notFoundHandler = (req, res, next) => {
    // Skip 404 errors for session-related requests
    if (req.path.startsWith('/_session')) {
        return next();
    }
    next(new ExpressError(404, 'Page not found'));
};

// Error handling middleware - must be after 404 handler
const errorHandler = (err, req, res, next) => {
    // Log error for debugging, but only if not session-related
    if (!req.path.startsWith('/_session')) {
        console.error(err);
    }
    
    let { status = 500, message = "Something went wrong" } = err;
    
    // Handle Joi validation errors
    if (err.isJoi) {
        status = 400;
        message = err.details.map(detail => detail.message).join(', ');
    }
    
    // Handle MongoDB errors (CastError, duplicate key, connection errors)
    if (err.name === 'CastError') {
        status = 400;
        message = 'Invalid ID format';
    } else if (err.code === 11000) {
        status = 400;
        message = 'Duplicate field value entered';
    } else if (err.name === 'MongoServerError') {
        status = 500;
        message = 'Database error occurred';
    }

    // Handle general validation errors
    if (err.name === 'ValidationError') {
        status = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    // Render a custom error page for 404 errors
    if (status === 404) {
        return res.status(404).render('listings/error', { message });
    }

    // Set error flash message and redirect to the listings index page
    req.flash('error', message);
    res.redirect('/listings');
};

module.exports = { notFoundHandler, errorHandler }; 