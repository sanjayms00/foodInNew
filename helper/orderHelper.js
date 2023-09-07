const Users = require("../models/public/userModel")
const Orders = require("../models/admin/ordersModel")
const Cart = require('../models/public/cartModel')
const mongoose = require('mongoose')
const orders = require('../models/admin/ordersModel')


//cancel order and refund for online payment
const cancelOrder = (orderId) =>{
    return new Promise((resolve, reject)=>{
        const cancelOrder = Orders.updateOne({_id : orderId}, {$set : {status : 'canceled', canceledTime : new Date()}})
        const findOrder = Orders.findOne({_id : orderId})
        Promise.all([cancelOrder, findOrder])
        .then(async (values) => {
            const subTotal = values[1].subTotal
            //console.log('subtotal:',subTotal)
            //take wallet amount if exist
            let walletAmount = 0
            if(values[1].walletAmount){
                walletAmount = values[1].walletAmount
            }
            //console.log('wallet amount :', walletAmount)
            const user = values[1].user
            const totalRefund = subTotal + walletAmount
            const transaction = {
                amount: totalRefund,
                TransactionType: 'credit',
                orderId: orderId,
                time: new Date()
            };
            // console.log(values[1].paymentMethod )
            if(values[1].paymentMethod === 'onlinePay'){
                //console.log('total : ', totalRefund)
                await Users.updateOne({_id : user}, 
                    {
                        $inc: { wallet : totalRefund},
                        $push: { walletTransactions : transaction },
                    })
                .then((response)=>{
                    resolve('Order Canceled, and Amount Refund Started')
                })
            }else if(values[1].paymentMethod === 'wallet'){
                // console.log('total : ', totalRefund)
                await Users.updateOne({_id : user}, 
                    {
                        $inc: { wallet : totalRefund},
                        $push: { walletTransactions : transaction },
                    })
                    .then((response)=>{
                        resolve('Order Canceled, and Amount Refund Started')
                    })
                    resolve('Order Canceled Refund Started')
            }else if (values[1].paymentMethod === 'cod'){
                resolve('Order Canceled')
            }
        }).catch((err)=>{
            reject(err)
        })
    })
}

const makeOrder = (data) => {
    totalPrice = parseInt(data.totalPrice)
    let paymentStatus = 'pending'
    if(totalPrice === 0 && data.paymentOption === 'wallet'){
        paymentStatus = 'recieved'
    }
    return new Promise(async (resolve, reject)=>{

        const orderDetails = {
            items : data.cartItems,
            user : data.userId,
            address : data.address,
            time : new Date(),
            status : "placed",
            subTotal : data.totalPrice,
            paymentStatus : paymentStatus,
            paymentMethod : data.paymentOption,
            walletAmount : 0,
            price : data.price,
            discount : data.discount ? data.discount : data.discount,
            discountedPrice : data.discountedPrice ? data.discountedPrice : '',
            couponCode : data.couponCode ? data.couponCode : '',
            walletAmount : data.walletAmount ? data.walletAmount : '',
        }
        const orderData = new Orders(orderDetails);
        //save the order
        try {
            const response = await orderData.save();
            await Users.updateOne({_id : data.userId}, {
                $push : {usedCoupons : data.couponCode}
            })
            resolve(response._id);
        } 
        catch (err) {
            reject(err);
        }
    })
}

const emptyCart = (userId) => {
    return new Promise(async (resolve, reject)=>{
        await Cart.deleteOne({userId})
        .then((response)=>{
            resolve(response)
        })
        .catch((err)=>{
            reject(err)
        })
    })
}


// const updateWallet = (userId, walletAmount, orderId) => {
//     return new Promise(async (resolve, reject)=>{
//         console.log(userId, walletAmount, orderId)
//         const transaction = {
//                 amount : walletAmount,
//                 TransactionType : 'debit',
//                 orderId : orderId,
//                 time : new Date()
//         }
//         await Users.updateOne(
//             { _id: new mongoose.Types.ObjectId(userId) },
//             {
//                 $inc: { 'wallet.balance': -walletAmount },
//                 $push: { 'wallet.walletTransactions': transaction },
//                 $set: { 'wallet.lastUpdated': new Date() }
//             })
//         .then((response)=>{
//             console.log(response)
//             resolve(response)
//         })
//         .catch((err)=>{
//             reject(err)
//         })
//     })
// }


const findInvoiceOrder  = (orderId, userId) => {
    try {
      return new Promise(async (resolve, reject) => {
        await orders.find({_id : new mongoose.Types.ObjectId(orderId), user : new mongoose.Types.ObjectId(userId)})
        .then((response) => {
          resolve(response)
        });
      });
    } catch (error) {
      res.render("public/errorPage", {msg : error.message})
    }
}



const updateWallet = (userId, walletAmount, orderId) => {
    return new Promise(async (resolve, reject) => {
        const transaction = {
            amount: walletAmount,
            TransactionType: 'debit',
            orderId: orderId,
            time: new Date()
        };

        try {
            if(walletAmount > 0){
                var response = await Users.updateOne(
                    { _id: new mongoose.Types.ObjectId(userId) },
                    {
                        $inc: { wallet : -walletAmount },
                        $push: { walletTransactions : transaction },
                    }
                );
            }else{
                var response = await Users.updateOne(
                    { _id: new mongoose.Types.ObjectId(userId) },
                    {
                        $inc: { wallet : -walletAmount }
                    }
                );
            }

            resolve(response);
        } catch (err) {
            console.error('Update Error:', err);
            reject(err);
        }
    });
};





module.exports = {
    cancelOrder,
    makeOrder,
    emptyCart,
    updateWallet,
    findInvoiceOrder
}