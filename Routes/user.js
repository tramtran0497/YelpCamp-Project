const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')
const catchAsync = require('../utilis/catchAsync')

router.get('/register', (req, res) => {
    res.render('user/register')
})

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const {
            username,
            email,
            password
        } = req.body
        const user = new User({
            email,
            username
        })
        // register method also save automatically, we do not use .save()
        const registerdUser = await User.register(user, password)
        // to make sure every time we register, we also log in automatically. We use login()
        req.login(registerdUser, err => {
            // call back function
            if (err) return next(err) // move next to the specail middleware
            // console.log(registerdUser)
            req.flash('success', "Successful! Welcome to Campgrounds!!!")
            res.redirect('/campgrounds')
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}))

router.get('/login', (req, res) => {
    res.render('user/login')
})

// normally, we have to create a middleware to authenticate the user, but now we just need to use method passport.authenticate()
router.post('/login', passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login'
}), async (req, res) => {
    req.flash('success', 'Welcome back!')
    // we must know where user is before asking log in
    const requestUrl = req.session.returnTo || '/campgrounds' //if they click login firstly
    // delete helps us to delete the url where you stay before asking login, then it is new, refresh!
    delete req.session.returnTo
    res.redirect(requestUrl)
})

router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success', 'Goodbye, See you then!')
    res.redirect('/campgrounds')
})
module.exports = router