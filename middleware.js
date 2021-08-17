const Campground = require('./models/campground')
const {campgroundSchema, reviewSchema} = require('./schemas.js')
const ExpressError = require('./utilis/ExpressError')
const Review = require('./models/review')

// making a middleware 
module.exports.isLoggedIn = (req, res, next) => {
    //store the url of request, and we see req.originalUrl is more detail
    // therefore we create 
    req.session.returnTo = req.originalUrl // to insert the url inside returnTo
    // console.log(req.path, req.originalUrl)
    // console.log('REQ USER....', req.user)
    // passport also has a method name isAuthenticated() to veerify who is using
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be singed in!')
        return res.redirect('/login')
    }
    //otherwise go next
    next()
}

module.exports.isAuthor = async (req,res,next)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to edit this campground!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.isReviewAuthor = async (req,res,next)=>{
    const {id, reviewId} = req.params
    const review = await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to edit this campground!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}


// we create one seprerate function that can help Joi object
module.exports.validateCampground = (req, res, next) => {
    // we create one file with name schemas and save the Joi schema in this
    const {error} = campgroundSchema.validate(req.body)
    // console.log(JSON.stringify(error))
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else{
        next()
    }
}

module.exports.validateReview = (req, res, next) => {
    // we create one file with name schemas and save the Joi schema in this
    const {error} = reviewSchema.validate(req.body)
    // console.log(JSON.stringify(error))
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else{
        next()
    }
}