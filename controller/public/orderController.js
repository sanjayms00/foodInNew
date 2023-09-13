const Orders = require('../../models/admin/ordersModel')
const mongoose  = require('mongoose')
const orderHelper = require('../../helper/orderHelper')



//--------------------------------------------------------------------------------------------

//show current orders
const currentOrders = async (req, res) => {
    try {
        if(!req.session.isauth){
            res.render("public/errorPage", {status : "error", msg : "user not found"})
        }
        const userId = new mongoose.Types.ObjectId(req.session.isauth)
        const orders = (await Orders.find({ user: userId, status : {$nin : ["canceled", "delivered"] }}).sort({time : -1}).populate('user').exec());
        res.render("public/currentOrders", {data : orders})
    } catch (error) {
        res.render("public/errorPage", {status : "error", msg : "Issue loading the page"})
    }
}


//--------------------------------------------------------------------------------------------

//canceled order page
const canceledOrders = async (req, res) => {
    try {
        if(!req.session.isauth){
            res.render("public/errorPage", {status : "error", msg : "user not found"})
        }
        const userId = new mongoose.Types.ObjectId(req.session.isauth)
        const orders = await Orders.find({ user: userId, status : "canceled" }).sort({canceledTime : -1}).populate('user').exec();
        res.render("public/canceledOrders", {data : orders})
    } catch (error) {
        res.render("public/errorPage", {status : "error", msg : "Issue loading the page"})
    }
}


//--------------------------------------------------------------------------------------------

// load the order history
const orderHistory = async (req, res) => {
    try {
        if(!req.session.isauth){
            res.render("public/errorPage", {status : "error", msg : "user not found"})
        }
        const userId = new mongoose.Types.ObjectId(req.session.isauth)
        const orders = (await Orders.find({user : userId, paymentStatus : 'recieved' }).sort({deliveredTime : -1}).populate('user').exec())
        res.render("public/orderHistory", {data : orders})
    } catch (error) {
        res.render("public/errorPage", {status : "error", msg : "Issue loading the page"})
    }
}


//--------------------------------------------------------------------------------------------

//cancel the order user side
const cancelOrder = async (req, res) => {
    try {
        const orderId = new mongoose.Types.ObjectId(req.body.id)
        if(!orderId){
            return res.status(404).json({status : "error", msg : "order not Found"})
        }
        const validateOrder = await Orders.find({_id : orderId}, {status : 1, _id : 0})
        if(validateOrder[0].status !== 'canceled')
        {
            await orderHelper.cancelOrder(orderId)
            .then((response)=>{
                res.status(200).json({status : "success", msg : response})
            }) 
        }else{
            res.status(400).json({status : "canceled", msg : "Order is already canceled"})
        }
        
    } catch (error) {
        return res.status(400).json({status : "error", msg : error.message})
    }
}




//--------------------------------------------------------------------------------------------

//invoice downloader
const downloadInvoice = async (req, res) => {
    try {
        const userId = req.session.isauth;

        const orderId = req.params.orderId;
        const orderData = await orderHelper.findInvoiceOrder(orderId, userId);

        const pdfBuffer = await orderHelper.generateInvoicePDF(orderData);

        res.setHeader('Content-Disposition', `attachment; filename=invoice_${orderId}.pdf`);
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        res.status(500).render('public/errorPage', {msg : error.message});
    }
}


//--------------------------------------------------------------------------------------------

//exporting the functions
module.exports = {
    currentOrders,
    orderHistory,
    canceledOrders,
    cancelOrder,
    downloadInvoice
}