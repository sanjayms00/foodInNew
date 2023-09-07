
const { Double } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    items: {
        type : [],
        ref : "Foods"
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref: 'Users'
    },
    address: {
        type : String,
        require : true 
    },
    userName: {
        type : String,
        require : true 
    },
    time: {
        type : Date,
        require : true 
    },
    deliveredTime: {
        type : Date
    },
    canceledTime: {
        type : Date
    },
    status: {
        type : String,
        require : true 
    },
    paymentStatus: {
        type : String,
        require : true 
    },
    paymentMethod: {
        type : String,
        require : true 
    },
    discount: {
        type : Number,
        require : true 
    },
    discountedPrice: {
        type : Number,
        require : true 
    },
    couponCode: {
        type : String,
        require : true 
    },
    price: {
        type : Number,
        require : true 
    },
    walletAmount: {
        type : Number,
    },
    subTotal: {
        default: 0,
        type: Number,
        required : true
    }
});

const Orders = mongoose.model("Orders", orderSchema)

module.exports = Orders;

