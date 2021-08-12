const express = require('express')
const router = express.Router()
const catchAsync = require('../utilis/catchAsync')
const Campground = require('../models/campground')
const {campgroundSchema} = require('../schemas.js')
const ExpressError = require('../utilis/ExpressError')


// we create one seprerate function that can help Joi object
const validateCampground = (req, res, next) => {
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
router.get('/', catchAsync(async (req, res, next) => {
    // go to mongodb to find Campground collection
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
}))
router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})
// it means validateCampground run firstly
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    // console.log('===========================')
    // we create one ExpressError for can not store data which you create without name, value are required
    //if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400) However, it is basic!
    //try {
    // after create a new campground on routerlication, we post it and create a new Campground and save
    const campground = new Campground(req.body.campground)
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
    const campground = await Campground.findById(id).populate('reviews')
    if(!campground){
        req.flash('error', 'Not Found This Page!')
        return res.redirect('/campgrounds')
    }
    // console.log(campground)
    res.render('campgrounds/show', {campground})
}))
router.get('/:id/edit', catchAsync(async (req, res, next) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash('error', 'Not Found This Page!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground})
}))
router.put('/:id', validateCampground,catchAsync(async (req, res, next) => {
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    req.flash('success','Successfully updated a campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))
router.delete('/:id', catchAsync(async (req, res, next) => {
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success','Successfully delete a campground!')
    res.redirect('/campgrounds')
}))

module.exports = router