const express = require('express')
const router = express.Router()
const passport = require('passport')
const catchAsync = require('../utilis/catchAsync')
const users = require('../controller/user')
// const User = require('../models/user')
router.route('/register')
    .get(users.getRegister)
    .post(catchAsync(users.postRegister))
router.route('/login')
    .get(users.getLogin)
    .post(passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/login'
    }), users.postLogin)
router.get('/logout', users.logout)
// router.get('/register', users.getRegister)
// router.post('/register', catchAsync(users.postRegister))
// router.get('/login', users.getLogin)
// normally, we have to create a middleware to authenticate the user, but now we just need to use method passport.authenticate()
// router.post('/login', passport.authenticate('local', {
//     failureFlash: true,
//     failureRedirect: '/login'
// }), users.postLogin)
// router.get('/logout', users.logout)
module.exports = router