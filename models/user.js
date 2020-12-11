const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model('User',userSchema);