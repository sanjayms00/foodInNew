const Orders = require('../../models/admin/ordersModel')
const mongoose  = require('mongoose')
const orderHelper = require('../../helper/orderHelper')
var easyinvoice = require('easyinvoice');
const fs = require('fs');

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

//cancel the order user side
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

//invoice downloader
const downloadInvoice = async (req, res) => {
    try {
        const id = req.params.orderId;
        const userId = req.session.isauth;
        const result = await orderHelper.findInvoiceOrder(id, userId);


        const order = {
            id: id,
            total: result[0].walletAmount + result[0].subTotal,
            date: result[0].time, // Use the formatted date
            paymentMethod: result[0].paymentMethod,
            paymentStatus: result[0].paymentStatus,
            orderStatus: result[0].status,
            address: result[0].address,
            product: result[0].items,
            deliveredTime: result[0].deliveredTime
        };
        //set up the product
        const products = order.product.map((product) => ({
            "quantity": parseInt(product.quantity),
            "description": product.carted.foodName,
            "price": parseInt(product.carted.discPrice),
            "total": parseInt(product.total),
            "tax-rate" : 0
          }))

        const isoDateString = order.date;
        const isoDate = new Date(isoDateString);

        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = isoDate.toLocaleDateString('en-US', options);

        const data = {
            
            "customize": {
                //  "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html 
            },
            "images": {
                // The invoice background
                "background": "https://public.easyinvoice.cloud/img/watermark-draft.jpg"
            },
            // Your own data
            "sender": {
                "company": "foodIn",
                "address": "foodIn Round North",
                "city": "Thsissur",
                "country": "India"
            },
            // Your recipient
            "client": {
                "company": "Customer Address",
                "address": order.address,
            },
            "information": {
                // Invoice number
                "number": 'order'+order.id,
                // ordered date
                "date": formattedDate,
                // food delivered date
                "due date": "Nil"
            },
            "products": products,
            "bottom-notice": "Happy shoping and visit foodin again",
        };
        
        const pdfResult = await new Promise((resolve, reject) => {
            easyinvoice.createInvoice(data, (result) => {
                const randomInt = Math.floor(Math.random() * 100000);
                const filename = "invoice_" + randomInt + ".pdf";

                fs.writeFileSync("views/uploads/" + filename, result.pdf, 'base64');

                resolve(result);
            });
        });

        // Send a response back to the frontend
        res.status(200).json({ message: 'Invoice generated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//rate order foods
const rating = async (req, res) => {
    try{
        console.log(req.body)
    } catch (err) {

    }
}



module.exports = {
    currentOrders,
    orderHistory,
    canceledOrders,
    cancelOrder,
    downloadInvoice,
    rating
}