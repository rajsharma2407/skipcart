const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    categoryName:{
        type:String,
        required:true
    },
    categorySlug:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('Category',categorySchema);