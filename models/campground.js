const mongoose = require('mongoose')
// making it short. we can se Schema instead of mongoose.Schema
const Schema = mongoose.Schema
const Review = require('./review')

//create a Schema
const campgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews:[{
        type: Schema.Types.ObjectId, 
        ref: 'Review'
    }]
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