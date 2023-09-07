//create schema structure of document
const mongoose = require("mongoose")


const walletTransactionSchema = new mongoose.Schema({
    amount :{
        type : Number,
    },
    TransactionType : {
        type : String   //  debit / credit
    },
    orderId : {
        type : mongoose.Schema.Types.ObjectId
    },
    time : {
        type : Date
    }
});

const addressSchema = new mongoose.Schema({
    fullName : {
        type : String,
        required : true
    }, 
    mobileNumber : {
            type : Number,
            required : true
        }, 
    pinCode : {
        type : Number,
        required : true
    }, 
    addressLine : {
        type : String,
        required : true
    }, 
    city : {
        type : String,
        required : true
    }, 
    state : {
        type : String,
        required : true
    }, 
    addressType : {
        type : String,
        required : true
    }
})



const userSchema = new  mongoose.Schema({
    
    firstName : {
        type : String,
        required : true
    },
    usedCoupons : {
        type : Array
    },
    lastName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    phone : {
        type: String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    usedCoupons : {
        type : Array
    },
    image : {
        type : String
    },
    defaultAddress  : {
        type : mongoose.Schema.Types.ObjectId
    },
    addresses : {
        type : [addressSchema]
    },
    confirmSecret : {
        type : String,
    },
    tempSecret : {
        type : String,
    },
    isVarified : {
        type : Boolean,
        required :true
    },
    blocked : {
        type : Boolean,
        required : true
    },
    wallet: {
        type : Number,
        required : true,
        default : 0
    },
    walletTransactions : {
        type : [walletTransactionSchema],
        required : true
     }
})

//define Model
const Users = mongoose.model("Users", userSchema)

module.exports = Users;



