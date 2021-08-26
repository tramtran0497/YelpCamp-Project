const express = require('express')
const router = express.Router()
const catchAsync = require('../utilis/catchAsync')
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')
const campgrounds = require('../controller/campgrounds')
const multer  = require('multer')
const {storage} = require('../cloudinary')
// const upload = multer({ dest: 'uploads/' }) it means we store ing in upload file but we store on cloudiany so we change
const upload = multer({storage})
// const {campgroundSchema} = require('../schemas.js')
// const ExpressError = require('../utilis/ExpressError')
// const Campground = require('../models/campground')
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
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image'),validateCampground, catchAsync(campgrounds.postNew))
    // .post(upload.array('image'),(req,res)=>{
    //     //we use upload.single to catch the file from HTML form, and the req.body will catch the text fields
    //     // if we use upload.array we can upload multiple files, then we change req.file to req.files
    //     console.log(req.body,'==========', req.files)
    //     res.send('IT WORKED!')
    // })
router.get('/new', isLoggedIn, campgrounds.getNew)
router.route('/:id')
    .get(catchAsync(campgrounds.show))
    .put(isLoggedIn, isAuthor,upload.array('image'),validateCampground,catchAsync(campgrounds.putEdit))
    .delete(isLoggedIn,  catchAsync(campgrounds.delete))
router.get('/:id/edit', isLoggedIn, isAuthor,catchAsync(campgrounds.getEdit))
// The below is old version
// router.get('/', catchAsync(campgrounds.index))
// router.get('/new', isLoggedIn, campgrounds.getNew)
// it means validateCampground run firstly
// router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.postNew))
// router.get('/:id', catchAsync(campgrounds.show))
// router.get('/:id/edit', isLoggedIn, isAuthor,catchAsync(campgrounds.getEdit))
// router.put('/:id', isLoggedIn, isAuthor,validateCampground,catchAsync(campgrounds.putEdit))
// router.delete('/:id',isLoggedIn,  catchAsync(campgrounds.delete))

module.exports = router