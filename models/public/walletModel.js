const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    orderId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    time : {
        type : Date,
        required : true
    },
    process : {
        type : string,
        required : true
    }


})
const walletSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    balance : {
        type : Number,
        default : 0
    },
    transactions : {
        type : [transactionSchema]
    }

})


module.export = mongoose.model('Wallet', walletSchema)