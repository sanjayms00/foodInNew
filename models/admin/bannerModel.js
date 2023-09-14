const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema({
    image : {
        type : String,
        require : true
    },
    position : {
        type : Number,
        default : 0
    },
    url : {
        type : String,
        required : true
    },
    status : {
        type : Boolean,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    heading : {
        type : String,
        required : true
    }
})

//exports model
module.exports = mongoose.model('Banners', bannerSchema)