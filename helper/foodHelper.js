const Food = require('../models/admin/foodModel')
const mongoose = require("mongoose")


function changeStock(cartItems){
    return new Promise(async (resolve, reject)=>{
        cartItems = JSON.parse(cartItems)
        for (const cartItem of cartItems) {
            const itemId = new mongoose.Types.ObjectId(cartItem.item);
            const quantity = cartItem.quantity;
            // Update the stock in the MongoDB collection
            await Food.updateOne(
              {_id : itemId},
              { $inc: { totalStoke: -quantity } }
            )
            .then((res)={
            })
            .catch((err)=>{
                reject(err)
            })
        }
        resolve(true);
    })
}



const checkStock = (cartItems) => {
    return new Promise(async (resolve, reject)=>{
        //parse the data
        cartItems = JSON.parse(cartItems)

        for (const cartItem of cartItems) {
            const itemId = new mongoose.Types.ObjectId(cartItem.item); 
            const quantity = cartItem.quantity;
        
            const item = await Food.find({_id : itemId}); 
            if (!item) {
                reject("No product found")
            }
            if (item.totalStoke < quantity) {
                reject("insufficient stock")
            }
        }
        resolve(true)
    })
}

module.exports = {
    checkStock,
    changeStock
}