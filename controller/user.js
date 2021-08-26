const User = require('../models/user')

module.exports.getRegister = (req, res) => {
    res.render('user/register')
}

module.exports.postRegister = async (req, res, next) => {
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
}

module.exports.getLogin = (req, res) => {
    res.render('user/login')
}

module.exports.postLogin = async (req, res) => {
    req.flash('success', 'Welcome back!')
    // we must know where user is before asking log in
    // let requestUrl = req.session.returnTo || '/campgrounds' //if they click login firstly
    let requestUrl = req.session.returnTo || '/campgrounds'
    // console.log('>>>>>>>>>>>', req.method, req.requestUrl)
    // delete helps us to delete the url where you stay before asking login, then it is new, refresh!
    // console.log('--------============', requestUrl)
    delete req.session.returnTo
    res.redirect(requestUrl)
}

module.exports.logout = (req, res) => {
    req.logout()
    req.flash('success', 'Goodbye, See you then!')
    res.redirect('/campgrounds')
}