const passport = require('passport');
const googleStrategy = require('passport-google-oauth2');

passport.use(new googleStrategy({
    clientID:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    callbackURL:process.env.GOOGLE_CALLBACK
},function(request,accessToken, refreshToken,profile,done){
    return done(null,profile);
}))

passport.serializeUser((user,done)=>done(null,user))
passport.deserializeUser((user,done)=>done(null,user))