const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required().messages({
            'string.empty': 'Title is required'
        }),
        description: Joi.string().required().messages({
            'string.empty': 'Description is required'
        }),
        location: Joi.string().required().messages({
            'string.empty': 'Location is required'
        }),
        country: Joi.string().required().messages({
            'string.empty': 'Country is required'
        }),
        price: Joi.number().required().min(0).messages({
            'number.base': 'The Price must be a number',
            'number.min': 'The Price must be a positive number',
            'any.required': 'Price is required'
        }),
        image: Joi.string().allow("", null).messages({
            'string.empty': 'Image can be empty'
        })
    }).required()
});


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
      comment: Joi.string().required().messages({
        'string.empty': 'Comment is required',
        'any.required': 'Comment is required'
      }),
      rating: Joi.number().min(1).max(5).required().messages({
        'number.base': 'The rating must be a number',
        'number.min': 'The rating must be a positive number between 1 to 5',
        'number.max': 'The rating must be between 1 to 5',
        'any.required': 'Rating is required'
      }),
    }).required().messages({
      'any.required': ' Comment and Rating(1 to 5) both are required',
    })
  });
 