// after install express
const express = require('express')
// to conect to the link below
const path = require('path')
// when using mongoose
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const Campground = require('./models/campground')
const { error } = require('console')
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
})
//short word
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', ()=>{
    console.log('Database connected')
})
// run the app
const app = express()
// write it when using ejs-mate
app.engine('ejs', ejsMate)
app.set('view engine','ejs')
// remmember 'views' different from 'view'
app.set('views',path.join(__dirname,'view'))

// this one helps parse information after submit/create new campground to db
app.use(express.urlencoded({extended:true}))
// this allows you can oveerride method 
app.use(methodOverride('_method'))

// app.use('/campgrounds', (req,res,next)=>{
//     console.log('AAAAAAA')
//     let h = 4
//     next(h)
// })

app.get('/',(req,res)=>{
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

app.get('/campgrounds',async (req,res)=>{
    // go to mongodb to find Campground collection
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
})
app.get('/campgrounds/new', (req,res)=>{
    res.render('campgrounds/new')
})

app.post('/campgrounds', async(req,res)=>{
    // after create a new campground on application, we post it and create a new Campground and save
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
})

app.get('/campgrounds/:id',async (req,res)=>{
    const {id} = req.params
    // to match id and find the correct db
    const campground = await Campground.findById(id)
    res.render('campgrounds/show',{campground})
})

app.get('/campgrounds/:id/edit', async (req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit',{campground})
})

app.put('/campgrounds/:id', async (req,res)=>{
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
    
})

app.delete('/campgrounds/:id', async(req,res) => {
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})


app.use((req,res,next,error)=>{
    console.log('error middleware')
    res.end()
})
// port 80 and 443 are default, so it will not appear onsearch bar or url
app.listen(3000,()=> console.log('Serving on port'))



