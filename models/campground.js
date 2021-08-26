const mongoose = require('mongoose')
// making it short. we can se Schema instead of mongoose.Schema
const Schema = mongoose.Schema
const Review = require('./review')
const User = require('./user')

//in order to make picture more beautiful, we create one schemaImage
const imgSchema = new Schema({
    url: String,
    filename: String
})
// if you wanna know should search schema.virtual
imgSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200')
})

const opts = { toJSON: { virtuals: true } };

//create a Schema
const campgroundSchema = new Schema({
    title: String,
    image: [imgSchema],
    geometry:{
        type: {
            type: String, 
            enum: ['Point'], 
            required: true
          },
        coordinates: {
            type: [Number],
            required:true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews:[{
        type: Schema.Types.ObjectId, 
        ref: 'Review'
    }]
},opts)

campgroundSchema.virtual('properties.popUp').get(function(){
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>`
})

campgroundSchema.post('findOneAndDelete', async function(data){
    // data is a campground
    if(data){
        await Review.deleteMany({
            _id: { $in: data.reviews}
        })
    }
})

// it will be exported a model with name Campground based on campgroundSchema
module.exports = mongoose.model('Campground', campgroundSchema)