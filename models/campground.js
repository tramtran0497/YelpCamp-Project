const mongoose = require('mongoose')
// making it short. we can se Schema instead of mongoose.Schema
const Schema = mongoose.Schema

//create a Schema
const campgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
})

// it will be exported a model with name Campground based on campgroundSchema
module.exports = mongoose.model('Campground', campgroundSchema)