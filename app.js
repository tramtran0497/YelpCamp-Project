// after install express
const express = require('express')
// to conect to the link below
const path = require('path')
// when using mongoose
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const Joi = require('joi')
// const {campgroundSchema, reviewSchema} = require('./schemas.js')
// const catchAsync = require('./utilis/catchAsync')
const ExpressError = require('./utilis/ExpressError')
const methodOverride = require('method-override')
// const Campground = require('./models/campground')
// const Review = require('./models/review')
const session = require('express-session')
const flash = require('connect-flash')
const campgrounds = require('./Routes/campground')
const reviews = require('./Routes/review')

// const {error} = require('console')
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    // mongoose complain! if any
    useFindAndModify: false
})
//short word
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
    console.log('Database connected')
})
// run the app
const app = express()
// write it when using ejs-mate
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
// remmember 'views' different from 'view'
app.set('views', path.join(__dirname, 'view'))
// we create one seprerate function that can help Joi object
// const validateCampground = (req, res, next) => {
//     // we create one file with name schemas and save the Joi schema in this
//     const {error} = campgroundSchema.validate(req.body)
//     console.log(JSON.stringify(error))
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else{
//         next()
//     }
// }
// const validateReview = (req, res, next) => {
//     // we create one file with name schemas and save the Joi schema in this

//     const {error} = reviewSchema.validate(req.body)
//     console.log(JSON.stringify(error))
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else{
//         next()
//     }
// }
//This one helps parse information after submit/create new campground to db
app.use(express.urlencoded({
    extended: true
}))
// this allows you can oveerride method 
app.use(methodOverride('_method'))
//use the following code to serve images, CSS files, and JavaScript files in a directory named public
app.use(express.static(path.join(__dirname,'public')))
app.use(session({
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, 
        maxAge : 1000 * 60 * 60 * 24 * 7 // a week
    }
}))
app.use(flash())
// app.use('/campgrounds', (req,res,next)=>{
//     console.log('AAAAAAA')
//     let h = 4
//     next(h)
// })

// made a middleware before run code below 'router capground and review'
app.use((req,res,next)=>{
    res.locals.message = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

app.get('/', (req, res) => {
    res.render('home')
})
// app.get('/makeCampground', async (req,res)=>{
//     const camp = new Campground({
//         title: 'My backyard',
//         description: 'cheap camping!'
//     })
//     await camp.save()
//     res.send(camp)
// })

// app.all('*', call back func) means if nothing matchs other above, it will run this code
app.all('*', (req, res, next) => {
    //we required ExpressError, so we can use this to custom our Error
    // however, it is not working because we use next() so it runs the next middleware, so we should custom the next middleware with default value
    next(new ExpressError('NOT FOUND!!!', 404))
})
app.use((err, req, res, next) => {
    const {status = 500} = err
    if (!err.message) err.message = 'Oh! Something went wrong!!!'
    res.status(status).render('error', {err})
})
app.use((req, res, next, error) => {
    console.log('error middleware')
    res.end()
})
// port 80 and 443 are default, so it will not appear onsearch bar or url
app.listen(3000, () => console.log('Serving on port'))