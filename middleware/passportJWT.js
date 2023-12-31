const config = require('../config/index')
const passport = require('passport')
const User = require('../models/user')
const models = require("../models");

const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.JWT_SECRET;
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = models.User.findOne({
            where:
                {
                    id: jwt_payload.id
                }
        })
        if (!user) {
            return done(new Error('ไม่พบผู้ใช้ในระบบ'))
        }
        return done(null, user)
    } catch (error) {
        done(error)
    }
}));
module.exports.isLogin = passport.authenticate('jwt', {session: false})