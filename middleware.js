// making a middleware 
module.exports.isLoggedIn = (req, res, next) => {
    //store the url of request, and we see req.originalUrl is more detail
    // therefore we create 
    req.session.returnTo = req.originalUrl // to insert the url inside returnTo
    // console.log(req.path, req.originalUrl)
    // console.log('REQ USER....', req.user)
    // passport also has a method name isAuthenticated() to veerify who is using
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be singed in!')
        return res.redirect('/login')
    }
    //otherwise go next
    next()
}