//create schema structure of document
const mongoose = require("mongoose")
const categorySchema = new  mongoose.Schema({
    categoryName : {
        type : String,
        required : true
    },
    status : {
        type : Boolean,
        required : true
    }
})

//define Model
const Category = mongoose.model("Category", categorySchema)

module.exports = Category;



