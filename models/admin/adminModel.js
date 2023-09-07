//create schema structure of document
const mongoose = require("mongoose")
const userSchema = new  mongoose.Schema({
    firstName : {
        type : String,
        required : true
    },
    lastname : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    phone : {
        type : Number,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    image : {
        type : String
    },
    addresses : {
        type : [Object]
    },
    cart : {
        type : [Object]
    },
    isVarified : {
        type : Boolean,
        required :true

    }
})

//define Model
const AdminUsers = mongoose.model("AdminUsers", userSchema)

module.exports = AdminUsers;



