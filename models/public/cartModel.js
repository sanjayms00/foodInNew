
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let ItemSchema = new Schema({
    foodId: {
        type: mongoose.Schema.Types.ObjectId,
       
    },
    quantity: {
        type: Number,
       
    },
    total: {
        type: Number,
        
    }
})
const CartSchema = new Schema({
    items: [ItemSchema],
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    subTotal: {
        default: 0,
        type: Number
    }
})

const Cart = mongoose.model("Cart", CartSchema)

module.exports = Cart;

