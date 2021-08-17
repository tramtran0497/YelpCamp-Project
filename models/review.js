const mongoose = require('mongoose')
// making it short. we can se Schema instead of mongoose.Schema
const Schema = mongoose.Schema

//create a Schema
const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})


// it will be exported a model with name Campground based on campgroundSchema
module.exports = mongoose.model('Review', reviewSchema)