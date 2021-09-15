# YelpCamp-Project
YelpCamp project is created for sharing travelling expriences. 
Users can easily to create, publish their campgrounds on YelpCamp community through locations, the prices as well as their own descriptions and interesting pictures. I make sure that your campground is shown details like you made, we have the map box, which shows the location as well as the review field. 
Besides, other users can leave their reviews to build a perfect campground. You can hold much imformation from our website! Let try our application.

## Installation
After you click and download the zip, let start to installation!
Your computer must install Node.js, REMEMBER to choose the suitable packages for your own computer. I leave the link download Node.js for MacOS here: [Node.js](https://nodejs.org/en/)
Opening terminal and install all things in "dependencies" fields:

```bash
npm install 
```
## Create .ENV file
To run the application, you need to create your own ".env" file.
Fristly, you should create your own account(if you have, skip this step). Both links:
 [Mapbox](https://account.mapbox.com/auth/signup/?route-to=%22https://account.mapbox.com/%22)
 and
 [Cloudinary](https://cloudinary.com/users/register/free).
 
 ```env
 MAPBOX_TOKEN=<your mapbox token here>
 CLOUDINARY_CLOUD_NAME=<your cloudinary name>
 CLOUDINARY_KEY=<your cloudinary key>
 CLOUDINARY_SECRET=<your cloudinary secret>
 ```
 
 ## Run your code
 Now, it is time for you to run the application!
 
 ``` bash
 npm start
 ```
 Opening your browser such as Google Chrome, typing "localhost:3000". 
 
 ## Heroku website
 if downloading and installing makes you spend much time to use the application, let try the link [YelpCamp](https://fathomless-sands-09705.herokuapp.com/campgrounds
). Register your account, then you can create and share your own travelling expriences with others.
