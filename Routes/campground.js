const express = require('express')
const router = express.Router()
const catchAsync = require('../utilis/catchAsync')
const Campground = require('../models/campground')
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')
// const {campgroundSchema} = require('../schemas.js')
// const ExpressError = require('../utilis/ExpressError')


// we create one seprerate function that can help Joi object
// const validateCampground = (req, res, next) => {
//     // we create one file with name schemas and save the Joi schema in this

//     const {error} = campgroundSchema.validate(req.body)
//     // console.log(JSON.stringify(error))
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else{
//         next()
//     }
// }
router.get('/', catchAsync(async (req, res, next) => {
    // go to mongodb to find Campground collection
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
}))
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
})
// it means validateCampground run firstly
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    // console.log('===========================')
    // we create one ExpressError for can not store data which you create without name, value are required
    //if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400) However, it is basic!
    //try {
    // after create a new campground on routerlication, we post it and create a new Campground and save
    const campground = new Campground(req.body.campground)
    // after creating a new campground, we add author for this campground by id of user is using
    campground.author = req.user._id
    await campground.save()
    req.flash('success','Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
    // } catch (e) {
    //     next(e)
    // }
}))
router.get('/:id', catchAsync(async (req, res, next) => {
    const {id} = req.params
    // to match id and find the correct db
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        } // it means nested populate()
    }).populate('author') // we populate author to see who created this campground
    console.log(campground)
    if(!campground){
        req.flash('error', 'Not Found This Page!')
        return res.redirect('/campgrounds')
    }
    // console.log(campground.author.username)
    res.render('campgrounds/show', {campground})
}))
router.get('/:id/edit', isLoggedIn, isAuthor,catchAsync(async (req, res, next) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    // finding this campground is exist or not? first
    if(!campground){
        req.flash('error', 'Not Found This Page!')
        return res.redirect('/campgrounds')
    }
    // checking the author!
    // if(!campground.author.equals(req.user._id)){
    //     req.flash('error', 'You do not have permission to edit this campground!')
    //     return res.redirect(`/campgrounds/${id}`)
    // }
   
    res.render('campgrounds/edit', {campground})
}))
router.put('/:id', isLoggedIn, isAuthor,validateCampground,catchAsync(async (req, res, next) => {
    const {id} = req.params
    // const campground = await Campground.findById(id)
    // if(!campground.author.equals(req.user._id)){
    //     req.flash('error', 'You do not have permission to edit this campground!')
    //     return res.redirect(`/campgrounds/${id}`)
    // }
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    req.flash('success','Successfully updated a campground!')
    res.redirect(`/campgrounds/${id}`) // id or campground._id
}))
router.delete('/:id',isLoggedIn,  catchAsync(async (req, res, next) => {
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success','Successfully delete a campground!')
    res.redirect('/campgrounds')
}))

module.exports = router