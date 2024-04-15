//create schema structure of document
const mongoose = require("mongoose")
const userSchema = new  mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    image : {
        type : String
    },
    isVarified : {
        type : Boolean,
        required :true
    }
})

//define Model
const AdminUsers = mongoose.model("AdminUsers", userSchema)

module.exports = AdminUsers;



