const mongoose = require('mongoose');

let helpSupport = new mongoose.Schema({
    issue : {
        type : String,
        required : true
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    replayed : {
        type : Boolean,
        default : false
    }
},{
    timestamps : true
})

//export the model
module.exports = mongoose.model('HelpSupport', helpSupport)