const passport = require('passport');
const googleStrategy = require('passport-google-oauth2');

passport.use(new googleStrategy({
    clientID:'492061640563-oius7eu4l89kugjq2qcl9mi4gdol4vbd.apps.googleusercontent.com',
    clientSecret:'M_WppXJr9x83WqV1g5h_RxHc',
    callbackURL:'http://skipcart.herokuapp.com/google-login'
},function(requrest,accessToken, refreshToken,profile,done){
    return done(null,profile);
}))

passport.serializeUser((user,done)=>done(null,user))
passport.deserializeUser((user,done)=>done(null,user))