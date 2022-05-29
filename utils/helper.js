// This is a function we can use to wrap our existing async route functions so they automatically catch errors
// and call the next() handler
module.exports.wrapAsync = function(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e))
    }
}