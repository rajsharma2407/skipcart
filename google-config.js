const passport = require('passport');
const googleStrategy = require('passport-google-oauth2');

passport.use(new googleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:process.env.CALLBACK_URL
},function(requrest,accessToken, refreshToken,profile,done){
    return done(null,profile);
}))

passport.serializeUser((user,done)=>done(null,user))
passport.deserializeUser((user,done)=>done(null,user))