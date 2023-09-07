//create schema structure of document
const mongoose = require("mongoose")
const couponSchema = new  mongoose.Schema({
    couponName : {
        type : String,
        required : true
    },
    discount : {
        type : Number,
        required : true
    },
    minPurchase : {
        type : Number,
        required : true
    },
    maxAmount : {
        type : Number,
        required : true
    },
    validity : {   
        type : Date,
        required : true
    },
    status : {
        type : Boolean,
        required : true
    }
})

//define Model
const coupon = mongoose.model("Coupon", couponSchema)

module.exports = coupon;



