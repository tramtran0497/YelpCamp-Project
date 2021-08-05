// we create one function to catch error
// 

module.exports = func => {
    return (req,res,next)=>  func(req,res,next).catch(e => next(e)) // we excute func and catch error if have
    
}