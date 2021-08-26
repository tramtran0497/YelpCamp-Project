const Campground = require('../models/campground')
const Review = require('../models/review')

module.exports.new = async(req,res)=>{
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review) // see more in show file!
    review.author = req.user._id
    campground.reviews.push(review) 
    await review.save()
    await campground.save()
    req.flash('success','Successfully created a new review!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.delete = async(req,res)=>{
    // res.send(req.params)
    const {id, reviewId} = req.params
    // console.log(id)
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}) // $pull will remove all reviews have reviewId
    await Review.findByIdAndDelete(reviewId)
    req.flash('success','Successfully delete a review!')
    res.redirect(`/campgrounds/${id}`)
}