const Joi = require('joi');

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string()
            .required()
            .min(3)
            .max(100)
            .messages({
                'string.empty': 'Title cannot be empty',
                'string.min': 'Title must be at least 3 characters long',
                'string.max': 'Title cannot exceed 100 characters',
                'any.required': 'Title is required'
            }),
        description: Joi.string()
            .required()
            .min(10)
            .max(1000)
            .messages({
                'string.empty': 'Description cannot be empty',
                'string.min': 'Description must be at least 10 characters long',
                'string.max': 'Description cannot exceed 1000 characters',
                'any.required': 'Description is required'
            }),
        country: Joi.string()
            .required()
            .min(2)
            .max(56)
            .messages({
                'string.empty': 'Country cannot be empty',
                'string.min': 'Country must be at least 2 characters long',
                'string.max': 'Country cannot exceed 56 characters',
                'any.required': 'Country is required'
            }),
        location: Joi.string()
            .required()
            .min(3)
            .max(100)
            .messages({
                'string.empty': 'Location cannot be empty',
                'string.min': 'Location must be at least 3 characters long',
                'string.max': 'Location cannot exceed 100 characters',
                'any.required': 'Location is required'
            }),
        price: Joi.number()
            .required()
            .min(1)
            .max(1000000)
            .messages({
                'number.base': 'Price must be a number',
                'number.min': 'Price must be at least 1',
                'number.max': 'Price cannot exceed 1,000,000',
                'any.required': 'Price is required'
            }),
        image: Joi.string()
            .allow("", null)
            .uri()
            .messages({
                'string.uri': 'Image must be a valid URL'
            })
    }).required()
}).messages({
    'object.base': 'Invalid listing data',
    'object.unknown': 'Invalid field in listing data'
});

module.exports = listingSchema;

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number()
            .required()
            .min(1)
            .max(5)
            .messages({
                'number.base': 'Rating must be a number',
                'number.min': 'Rating must be at least 1',
                'number.max': 'Rating cannot exceed 5',
                'any.required': 'Rating is required'
            }),
        comment: Joi.string()
            .required()
            .min(1)
            .max(500)
            .messages({
                'string.empty': 'Comment cannot be empty',
                'string.min': 'Comment must be at least 1 character long',
                'string.max': 'Comment cannot exceed 500 characters',
                'any.required': 'Comment is required'
            })
    }).required()
});

module.exports = { listingSchema, reviewSchema };