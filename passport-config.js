const localStrategy = require('passport-local')
const passport =require('passport');
const User = require('./models/user');
const bcrypt = require('bcrypt');
var id;
var user;
    const authenticateUser = async (email,password,done) =>{
         user = await User.findOne({email},(err,user)=>{
            if(err) console.log(err);
            if(user){
                return user;
            }
        });
        if(user!=null)
        id = user._id;
        if(user === null)
            return done(null,false,{message:"Email doesn't Exist"})
        try{
            if(await bcrypt.compare(password,user.password))
                return done(null,user,{message:"Login Successfully"})
            else
                return done(null,false,{message:"Password is incorrect"});
        }
        catch(e){
            console.log(e)
        }
    }
    passport.use(new localStrategy({usernameField:'email'},authenticateUser));
    passport.serializeUser((user,done)=>done(null,user));
    passport.deserializeUser((id,done)=>{
    return done(null,user)
    }
    );