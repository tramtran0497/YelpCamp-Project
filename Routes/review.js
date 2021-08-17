const express = require('express')
const router = express.Router({mergeParams: true}) // because in app.js, especially app.use we use the path including id. all files are separate. So, we need to use mergeParams
const ExpressError = require('../utilis/ExpressError')
// const {reviewSchema} = require('../schemas.js')
const catchAsync = require('../utilis/catchAsync')
const Campground = require('../models/campground')
const Review = require('../models/review')
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')

// const validateReview = (req, res, next) => {
//     // we create one file with name schemas and save the Joi schema in this
//     const {error} = reviewSchema.validate(req.body)
//     // console.log(JSON.stringify(error))
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else{
//         next()
//     }
// }
router.post('/', isLoggedIn, isReviewAuthor, validateReview, catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review) // see more in show file!
    review.author = req.user._id
    campground.reviews.push(review) 
    await review.save()
    await campground.save()
    req.flash('success','Successfully created a new review!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId', isLoggedIn,isReviewAuthor, catchAsync(async(req,res)=>{
    // res.send(req.params)
    const {id, reviewId} = req.params
    // console.log(id)
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}) // $pull will remove all reviews have reviewId
    await Review.findByIdAndDelete(reviewId)
    req.flash('success','Successfully delete a review!')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router