const Orders = require("../../models/admin/ordersModel")
const orderHelper = require('../../helper/orderHelper')
const mongoose = require("mongoose")

//show order page
const showOrders = async (req,res)=>{
    try {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const currentDay = currentDate.getDate();
        
        const orders = await Orders.aggregate([
            {
                $match : {
                    time : {
                        $gte: new Date(currentYear, currentMonth - 1, currentDay),
                        $lt: new Date(currentYear, currentMonth - 1, currentDay + 1)
                    }
                }
            },
            {$lookup : {
                from : 'users',
                localField : 'user',
                foreignField : '_id',
                as : 'orderData'
            }},
            {
                $unwind: '$orderData'
            },
            {
                $project: {
                  _id: 1,
                  items: 1,
                  user: 1,
                  address: 1,
                  time: 1,
                  status: 1,
                  paymentStatus: 1,
                  paymentMethod: 1,
                  walletAmount: 1,
                  subTotal: 1,
                  firstName: '$orderData.firstName', 
                  lastName: '$orderData.lastName',   
                }
            },
            {$sort : {_id : -1}}
        ]) 
        res.status(200).render("admin/orders/index", {data : orders})
    } catch (error) {
        console.log(error.message)
    }
}

//cancel the order
const cancelOrder = async (req, res) => {
    try {
        const orderId = new mongoose.Types.ObjectId(req.body.id)
        if(!orderId){
            return res.status(404).json({status : "error", msg : "order not Found"})
        }
        await orderHelper.cancelOrder(orderId)
        .then((response)=>{
            res.status(200).json({status : "success", msg : response})
        }) 
    } catch (error) {
        return res.status(400).json({status : "error", msg : error.message})
    }
}

//status change
const changeStatus = async (req, res) => {
    try {
        // console.log(req.body.id)
        const orderId = new mongoose.Types.ObjectId(req.body.id)
        const status = req.body.status
        if(!orderId){
            return res.status(404).json({status : "error", msg : "order not Found"})
        }
        if(status === "delivered"){
            console.log("deliverd")
            var updateStatus = await Orders.updateOne({_id : orderId}, {$set : {status : status, paymentStatus : 'recieved', deliveredTime : new Date()}})
        }else{
            var updateStatus = await Orders.updateOne({_id : orderId}, {$set : {status : status}})
        }
        if(!updateStatus){
            return res.status(400).json({status : "error", msg : "can't change status"})
        }
        res.status(200).json({status : "success", msg : "Status Chanaged", value : status})
    } catch (error) {
        return res.status(400).json({status : "error", msg : error.message})
    }
}

//export all functions like objects
module.exports = {
    showOrders,
    cancelOrder,
    changeStatus
    

}