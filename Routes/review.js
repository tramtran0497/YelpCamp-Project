const express = require('express')
const router = express.Router({mergeParams: true}) // because in app.js, especially app.use we use the path including id. all files are separate. So, we need to use mergeParams
const reviews = require('../controller/review')
const catchAsync = require('../utilis/catchAsync')
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')
// const ExpressError = require('../utilis/ExpressError')
// const {reviewSchema} = require('../schemas.js')
// const Campground = require('../models/campground')
// const Review = require('../models/review')
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
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.new))
router.delete('/:reviewId', isLoggedIn,isReviewAuthor, catchAsync(reviews.delete))

module.exports = router