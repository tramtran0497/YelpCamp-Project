const Campground = require('../models/campground')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding') //npm install mapbox
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({accessToken: mapBoxToken}) // read more github mapbox-sdk
const {cloudinary} = require('../cloudinary') // we create it when we delete img, it also delete img on cloud

module.exports.index = async (req, res, next) => {
    // go to mongodb to find Campground collection
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
}

module.exports.getNew = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.postNew = async (req, res, next) => {

    const geoData =  await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
      }).send()
    // firstly, console.log(geoData), it shows everything including body. we wanna see the body and exactly features
    // secondly, we console.log(geoData.body.features), it shows
    // why we need to know that we want to see the coordinates because we use forwardGeocoder, let check doc on Mapbox
    // console.log(geoData.body.features[0].geometry)
    // because features is an arraty, so if we wanna see it, we should let it know which one in an array we wanna see
    // Remember format of coordinates [longitude,latitude], but if you search on map gg the correct lat,long
    // res.send('It worked!')
    // console.log('===========================')
    // we create one ExpressError for can not store data which you create without name, value are required
    //if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400) However, it is basic!
    //try {
    // after create a new campground on routerlication, we post it and create a new Campground and save
    const campground = new Campground(req.body.campground)
    // after creating a new campground, we add author for this campground by id of user is using
    campground.geometry = geoData.body.features[0].geometry
    campground.image = req.files.map(f => ({url: f.path, filename: f.filename }))
    campground.author = req.user._id
    await campground.save()
    console.log('<<<<<>>>>>>>>>>', campground)
    req.flash('success','Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
    //} catch (e) {next(e)}
}

module.exports.show = async (req, res, next) => {
    const {id} = req.params
    // to match id and find the correct db
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        } // it means nested populate()
    }).populate('author') // we populate author to see who created this campground
    // console.log(campground)
    if(!campground){
        req.flash('error', 'Not Found This Page!')
        return res.redirect('/campgrounds')
    }
    // console.log(campground.author.username)
    res.render('campgrounds/show', {campground})
}

module.exports.getEdit = async (req, res, next) => {
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
}

module.exports.putEdit = async (req, res, next) => {
    const {id} = req.params
    console.log(req.body)
    // const campground = await Campground.findById(id)
    // if(!campground.author.equals(req.user._id)){
    //     req.flash('error', 'You do not have permission to edit this campground!')
    //     return res.redirect(`/campgrounds/${id}`)
    // }
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename }))
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    campground.image.push(...imgs)
    await campground.save()
    // for deleteImage[]
    console.log(req.body.deleteImage)
    if(req.body.deleteImage){
        for(let filename of req.body.deleteImage){ //because deleteImage array contains all img.filenames
           await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({$pull: {image: {filename: {$in: req.body.deleteImage}}}})
        console.log('=======--------=========',campground)
    }
    req.flash('success','Successfully updated a campground!')
    res.redirect(`/campgrounds/${id}`) // id or campground._id
}

module.exports.delete = async (req, res, next) => {
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success','Successfully delete a campground!')
    res.redirect('/campgrounds')
}

