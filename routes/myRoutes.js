const express = require('express');
const bcrypt = require('bcrypt')
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const Product = require('../models/products');

router.get('/',async (req,res)=>{
     Product.find({},async (err,product)=>{
         res.render('index',{products:product});
    })

})

router.get('/register',(req,res)=>{
    res.render('register',{name:"",email:"",password:""});
})

router.post('/register', (req,res)=>{
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({email:email},async (err,userExist)=>{
        if(err ) console.log(err);

        if(userExist){
            return res.render('register',{name:name,email:email,password:""});
        }else{
            var hashedPassword = await bcrypt.hash(password,10);
            var newUser = new User({
                name:name,
                email:email,
                password:hashedPassword
            })
            newUser.save(err=>{
                if(err) console.log(err)
                else{
                    console.log('User saved');

                }
                return res.redirect('/login');
            })
        }
    })
})

router.get('/login',(req,res)=>{
    res.render('login');
})

router.post('/login',passport.authenticate('local',{
    failureRedirect:'/login',
    failureFlash:true,
    successFlash:true
}),(req,res)=>{
    process.env.SESSION_NAME = req.body.email;
    if(req.body.email === 'admin'){
        res.redirect('/admin');
    }else{
        res.redirect('/')
    }
})

router.get('/google',passport.authenticate('google',{
    scope:['profile','email']
}))

router.get('/google-login',passport,authenticate('google',{failureRedirect:'/login',failureFlash:true,successFlash:true}),(req,res)=>{
    res.redirect('/');
})

router.get('/logout',(req,res)=>{
    req.flash('success','Logout Successfull')
    req.logout();
    res.redirect('/')
})

router.get('/product/:id',(req,res)=>{
    Product.findOne({_id:req.params.id},(err,product)=>{
        if(err) console.log(err);
        if(product){
        Product.find({productCategory:product.productCategory,_id:{$ne:product._id}},(err,pro)=>{
            res.render('product',{product:product,products:pro});
        })
        }
    })
})

// router.get('/flash',(req,res)=>{
//     req.flash('info','this is message');
//     // req.flash('this is message');
//     res.redirect('/');
// });

// router.get('/messages',(req,res)=>{
//     res.send(res.locals.messages)
// })
module.exports = router;