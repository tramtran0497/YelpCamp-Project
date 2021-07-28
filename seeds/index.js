// this index.js is created to set and seed database into main server if needs

const mongoose = require('mongoose')
const cities = require('./cities')
const {descriptors, places} = require('./seedHelpers')
// same parent folder
const Campground = require('../models/campground')
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
    // useCreateIndex:false,
    useUnifiedTopology:true
})
// In order to connect Database
//short word
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', ()=>{
    console.log('Database connected')
})

// sample is a function to choose one element in a given array
const sample = arr => arr[Math.floor(Math.random()* arr.length)]

const seedDB = async () =>{
    //why have to delete All?
    // because after reset and run new, it creates new DB
    // If have no delete, it will be duplicated
    await Campground.deleteMany({})
    // const c = new Campground ({title: 'purple fields'})
    // await c.save()
    for(let i =0; i < 50; i++){
        const random1000 = Math.floor(Math.random()*1000)
        const price = Math.floor(Math.random()*20) + 10
        const camp = new Campground({
            // in array cities, position 'random1000' and take keys 'city' and 'state'
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Beautiful Places',
            price
        })
        await camp.save()
    }
}
// it will be run if not call it
seedDB()
    // using '.close' to close automatically server everytime we open
    .then(()=> db.close())