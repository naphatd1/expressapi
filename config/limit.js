const ratelemit = require("express-rate-limit");
module.exports.limiter = ratelemit({
    windowMs: 10 * 1000,
    max: 5
})

