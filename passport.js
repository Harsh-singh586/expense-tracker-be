const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy
const getOrCreateUser = require('./auth')
const User = require('./model/user')

passport.use(new GoogleStrategy({
    clientID: "1058138316809-qa06lskk2t7id9j0ccefl3cjeo5nt73b.apps.googleusercontent.com",
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "/auth/google/callback",
},
    async function (req, accesstoken, refreshToken, profile, done) {
        console.log("profile", profile)
        var user = await getOrCreateUser('abc', profile)
        return done(null, user)
    }))


passport.serializeUser(function (user, done) {
    done(null, user)
})

passport.deserializeUser(async function (user, done) {
    var user = await User.findOne({ userId: user.userId })
    done(null, user)
})

