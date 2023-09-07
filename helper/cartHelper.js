const Food = require('../models/admin/foodModel')
const Cart = require('../models/public/cartModel')

const totalStock = (foodId) => {
    return new Promise(async (resolve, reject)=>{
        await Food.find({_id : foodId}, {totalStoke : 1})
        .then((reponse)=>{
            resolve(reponse)
        }).catch((err)=>{
            reject(err)
        })
    })
}

//find cart items
const getcartItems = (userId) => {
    return new Promise(async (resolve, reject)=>{
        await Cart.aggregate([
            {
              $match: { userId: userId }
            },
            {
              $unwind: "$items"
            },
            {
              $lookup: {
                from: "foods",
                localField: "items.foodId",
                foreignField: "_id",
                as: "carted"
              }
            },
            {
              $project: {
                item: "$items.foodId",
                quantity: "$items.quantity",
                total: "$items.total",
                // carted: { $arrayElemAt: ["$carted", 0] }
                _id : 0,
                carted : {
                    image : 1,
                    foodName : 1,
                    discPrice : 1
                }
              }
            }
        ])
        .then((res) =>{
            
            resolve(res)
        }).catch((err)=>{
            reject(err)
        })
    })
}
  
//find cart Total
const getcartTotal = (userId) => {
    return new Promise(async (resolve, reject) => {
        const cart = await Cart.aggregate([
            {
              $match: { userId: userId }
            },
            {
              $unwind: "$items"
            },
            {
              $lookup: {
                from: "foods",
                localField: "items.foodId",
                foreignField: "_id",
                as: "carted"
              }
            },
            {
              $project: {
                item: "$items.foodId",
                quantity: "$items.quantity",
                total: "$items.total",
                carted: { $arrayElemAt: ["$carted", 0] }
              }
            },
            {
              $group: {
                _id : null,
                subTotal: { $sum: { $multiply: ["$quantity", "$carted.discPrice"] } }
              }
            }
        ])
        .then((reponse)=>{
            resolve(reponse)
        }).catch((err)=>{
            reject(err)
        })
    })
}






module.exports = {
    totalStock,
    getcartItems,
    getcartTotal
}