const Joi = require('joi')
    // new! we use Joi, to create a schema which helps before we save data

module.exports.campgroundSchema =Joi.object({
    // because in Eit or New file, you can see the value we use ex. campground[price]
    campground: Joi.object({
        // it means the tile is written string type and you must fill the title, force!
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()

    }).required()
})
    
    