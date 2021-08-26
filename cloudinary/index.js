const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
// it is craeted for making a storage on cloudinary 
//?
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})
// create a clodinary basic
const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder: 'Yelp-Camp',
        allowedFormats: ['jpeg','png','jpg']
    }
})

module.exports={
    cloudinary,
    storage
}