require('dotenv').config();
const express = require('express');
const app = express();
const myRoutes = require('./routes/myRoutes')
const adminRoutes = require('./routes/adminRoutes');
const flash = require('express-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport')    
const User = require('./models/user')
const fileUpload = require('express-fileupload');
require('./passport-config')
var PORT = process.env.PORT || 8080;
 
 mongoose.connect('mongodb+srv://mongodbraj:mongodbraj@cluster0.rrtr0.mongodb.net/skipcart?retryWrites=true&w=majority',{useNewUrlParser: true, 
 useCreateIndex: true, 
 useUnifiedTopology: true, 
 useFindAndModify: false},err=>{
     if(err) console.log(err)
 });

 var db = mongoose.connection;
 db.once('open',()=>console.log('connection done'));
 db.on('error',console.error.bind(console,'mongoose error'))


app.set('view engine','ejs');

app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));

app.use(fileUpload());
app.use(session({
    secret:'SSSSHHhhhhh',
    resave:false,
    saveUninitialized:false,
    // cookie:{
    //     secure:true
    // }

}))
app.locals.user = null;
app.use(passport.initialize())
app.use(passport.session())

app.get('*',(req,res,next)=>{
    res.locals.user = req.user || null;
    next();
})

app.use(require('connect-flash')());
app.use((req,res,next)=>{
    res.locals.messages = require('express-messages')(req,res);
        next();
})
app.use('/',myRoutes);
app.use('/admin',adminRoutes);
app.listen(PORT,console.log(`server is started at port ${PORT}`))