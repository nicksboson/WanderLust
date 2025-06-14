const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const mongoose = require('mongoose');

// Validate MongoDB ID
const isValidId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

const validateListing = (req, res, next) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Invalid listing data");
    }
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.message);
    }
    next();
};

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, errMsg);
    }
    next();
};

module.exports = { validateListing, validateReview, isValidId }; 