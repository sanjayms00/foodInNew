
const mongoose = require('mongoose')
const Users = require("../../models/public/userModel")
const Orders = require("../../models/admin/ordersModel")
const Coupon = require('../../models/admin/couponModel')
const PaymentHelper = require("../../helper/paymentHelper")
const orderHelper = require("../../helper/orderHelper")
const cartHelper = require("../../helper/cartHelper")
const addressHelper = require("../../helper/addressHelper")
const foodHelper = require("../../helper/foodHelper")

//load checkout page
const checkout = async (req,res)=>{
    try {
        const userId = new mongoose.Types.ObjectId(req.session.isauth);
        if(!userId){
            return
        }
        const user = await Users.findOne({_id : userId})
        const cartTotal = await cartHelper.getcartTotal(userId)
        const cartItems = await cartHelper.getcartItems(userId)
        const defAddress = await addressHelper.getDefAddress(user.defaultAddress, userId) 
        const amount = cartTotal[0].subTotal
        //get used coupons from user
        const getUsedCoupons = await Users.findOne({_id : userId}, {usedCoupons : 1, _id : 0})
        
        const coupons = await Coupon.find(
          {  
            couponName : {$nin : getUsedCoupons.usedCoupons},
            minPurchase: { $lte: amount },
            maxAmount: { $gte: amount },
            validity: { $gte: new Date()},
            status: true
        });

        // console.log(amount , coupons)
        // console.log(cartTotal, cartItems, defAddress)
        if(cartItems.length < 1){
          res.render("public/errorPage", {status : "eroor", msg : "No items in the Cart"})
        }else if(cartTotal < 1){
          res.render("public/errorPage", {status : "eroor", msg : "No items in the Cart"})
        }
        res.render("public/checkOut", {subTotal : cartTotal, user, cartItems, defAddress, coupons})
    } catch (error) {
      res.render("public/errorPage", {status : "eroor", msg : error.message})
    }
    
}

const authCheckout = async (req,res)=>{
    try {
      const userId = new mongoose.Types.ObjectId(req.session.isauth);
      let { address, cartItems, price, totalPrice, paymentOption, discount, discountedPrice, couponCode } = req.body
      // console.log(address, cartItems, price, totalPrice, paymentOption, discount, discountedPrice, couponCode)
      // return
      //check the stock
      const checkStock = foodHelper.checkStock(cartItems)
      const changeStock = foodHelper.changeStock(cartItems)
      //order if stock is available
      Promise.all([checkStock, changeStock])
      .then(async ()=>{
        let walletAmount = 0
        if(req.body.walletAmount){
          walletAmount = req.body.walletAmount
        }
        if(!cartItems.length){
          return res.status(400).json({status : "error", msg : "No items in the Cart"})
        }
        if(!address){
          return res.status(404).json({status : "error", msg : "Address Not Found"})
        }
        cartItems = JSON.parse(cartItems)
          if(paymentOption === 'cod'){
            const data = {
              cartItems,
              userId,
              address,
              totalPrice,
              paymentOption,
              price
            }
            console.log(data)
            if(discount && discountedPrice && couponCode)
            {
              data.discount = discount;
              data.discountedPrice = discountedPrice;
              data.couponCode = couponCode;
            }
            const saveOrder = orderHelper.makeOrder(data)
            const deleteCart = orderHelper.emptyCart(userId)
            Promise.all([saveOrder, deleteCart]).then((values)=>{
              return res.status(200).json({status : "success", msg : "Order Placed", paymentMethod : paymentOption })
            })
          }
          else if(paymentOption === 'onlinePay')
          { 
            const data = {
              cartItems,
              userId,
              address,
              totalPrice,
              paymentOption,
              walletAmount,
              price
            }
            if(discount && discountedPrice && couponCode)
            {
              data.discount = discount;
              data.discountedPrice = discountedPrice;
              data.couponCode = couponCode;
            }
            const saveOrder = await orderHelper.makeOrder(data)
            const deleteCart = orderHelper.emptyCart(userId)
            const updateWallet = orderHelper.updateWallet(userId, walletAmount, saveOrder)
            Promise.all([deleteCart, updateWallet]).then(async (values)=>{
              const razorpayOrder = await PaymentHelper.generateRazorPay(saveOrder, totalPrice)
              // console.log(razorpayOrder)
              return res.status(200).json({status : "success", msg : "Order Placed", paymentMethod : paymentOption, razorpayOrder  })  
            })
          }
          else if(paymentOption === 'wallet')
          {
            const data = {
              cartItems,
              userId,
              address,
              totalPrice,
              paymentOption,
              walletAmount,
              price
            }
            if(discount && discountedPrice && couponCode)
            {
              data.discount = discount;
              data.discountedPrice = discountedPrice;
              data.couponCode = couponCode;
            }
            const saveOrder = await orderHelper.makeOrder(data)
            const deleteCart = orderHelper.emptyCart(userId)
            const updateWallet = orderHelper.updateWallet(userId, walletAmount, saveOrder)
            Promise.all([deleteCart, updateWallet]).then((values)=>{
              return res.status(200).json({status : "success", msg : "Order Placed", paymentMethod : paymentOption })
            })
          }else{
            return res.status(500).json({status : "error", msg : "Invalid Payment Option"})
          }
      })
    } catch (error) {
      return res.status(500).json({status : "error", msg : error.message})
    }
}


//payment verificatiion
const verifyPayment = async (req,res) => {
    try {
        const {response, order} = req.body
        await PaymentHelper.verifyRazorPayPayment(response, order)
        .then(async (result)=>{
        
          await Orders.updateOne(
                  {_id : new mongoose.Types.ObjectId(order.razorpayOrder.receipt)},
                  {$set : {paymentStatus : "recieved"}})
                  .then((updateResponse)=>{
                    res.status(200).json({status : "success", msg : "Payment successfull"})
                  })
                  .catch((err)=>{
                    res.status(500).json({status : "error", msg : "failed to upload the order status"})
                  })
        })
        .catch((err)=>{
          res.status(500).json({status : "error", msg : err.message})
        })
    } catch (error) {
      res.status(500).json({status : "error", msg : error.message})
    }
}


const success = (req, res) =>{
  res.render("public/orderPlaced")
}

const failed = (req, res) =>{
  res.render("public/errorPage", {status : 'error', msg : "Payment Failed"})
}


module.exports = {
    checkout,
    verifyPayment,
    authCheckout,
    success,
    failed
}