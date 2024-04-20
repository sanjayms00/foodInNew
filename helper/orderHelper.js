const Users = require("../models/public/userModel")
const Orders = require("../models/admin/ordersModel")
const Cart = require('../models/public/cartModel')
const mongoose = require('mongoose')
const orders = require('../models/admin/ordersModel')
const puppeteer = require('puppeteer');
const ejs = require('ejs')


//------------------------------------------------------------------------------------------------------------------------

//cancel order and refund for online payment
const cancelOrder = (orderId) => {
    return new Promise((resolve, reject) => {
        const cancelOrder = Orders.updateOne({ _id: orderId }, { $set: { status: 'canceled', canceledTime: new Date() } })
        const findOrder = Orders.findOne({ _id: orderId })
        Promise.all([cancelOrder, findOrder])
            .then(async (values) => {
                const subTotal = values[1].subTotal

                //take wallet amount if exist
                let walletAmount = 0
                if (values[1].walletAmount) {
                    walletAmount = values[1].walletAmount
                }

                const user = values[1].user
                const totalRefund = subTotal + walletAmount
                const transaction = {
                    amount: totalRefund,
                    TransactionType: 'credit',
                    orderId: orderId,
                    time: new Date()
                };

                if (values[1].paymentMethod === 'onlinePay') {

                    await Users.updateOne({ _id: user },
                        {
                            $inc: { wallet: totalRefund },
                            $push: { walletTransactions: transaction },
                        })
                        .then((response) => {
                            resolve('Order Canceled, and Amount Refund Started')
                        })
                } else if (values[1].paymentMethod === 'wallet') {

                    await Users.updateOne({ _id: user },
                        {
                            $inc: { wallet: totalRefund },
                            $push: { walletTransactions: transaction },
                        })
                        .then((response) => {
                            resolve('Order Canceled, and Amount Refund Started')
                        })
                    resolve('Order Canceled Refund Started')
                } else if (values[1].paymentMethod === 'cod') {
                    resolve('Order Canceled')
                }
            }).catch((err) => {
                reject(err)
            })
    })
}


//------------------------------------------------------------------------------------------------------------

//create an order
const makeOrder = (data) => {
    totalPrice = parseInt(data.totalPrice)
    let paymentStatus = 'pending'
    if (totalPrice === 0 && data.paymentOption === 'wallet') {
        paymentStatus = 'recieved'
    }
    return new Promise(async (resolve, reject) => {

        const orderDetails = {
            items: data.cartItems,
            user: data.userId,
            address: data.address,
            time: new Date(),
            status: "placed",
            subTotal: data.totalPrice,
            paymentStatus: paymentStatus,
            paymentMethod: data.paymentOption,
            walletAmount: 0,
            price: data.price,
            discount: data.discount ? data.discount : data.discount,
            discountedPrice: data.discountedPrice ? data.discountedPrice : '',
            couponCode: data.couponCode ? data.couponCode : '',
            walletAmount: data.walletAmount ? data.walletAmount : 0,
            rated: false
        }
        const orderData = new Orders(orderDetails);
        //save the order
        try {
            const response = await orderData.save();
            await Users.updateOne({ _id: data.userId }, {
                $push: { usedCoupons: data.couponCode }
            })
            resolve(response._id);
        }
        catch (err) {
            reject(err);
        }
    })
}


//-----------------------------------------------------------------------------------------------------------------
//delete from cart
const emptyCart = (userId) => {
    return new Promise(async (resolve, reject) => {
        await Cart.deleteOne({ userId })
            .then((response) => {
                resolve(response)
            })
            .catch((err) => {
                reject(err)
            })
    })
}


//------------------------------------------------------------------------------------------------------------------

//find the order
const findInvoiceOrder = (orderId, userId) => {
    try {
        return new Promise(async (resolve, reject) => {
            await orders.find({ _id: new mongoose.Types.ObjectId(orderId), user: new mongoose.Types.ObjectId(userId) })
                .then((response) => {
                    resolve(response)
                });
        });
    } catch (error) {
        res.render("public/errorPage", { msg: error.message })
    }
}


//-------------------------------------------------------------------------------------------------------------------------------

//update the wallet
const updateWallet = (userId, walletAmount, orderId) => {
    return new Promise(async (resolve, reject) => {
        const transaction = {
            amount: walletAmount,
            TransactionType: 'debit',
            orderId: orderId,
            time: new Date()
        };

        try {
            if (walletAmount > 0) {
                var response = await Users.updateOne(
                    { _id: new mongoose.Types.ObjectId(userId) },
                    {
                        $inc: { wallet: -walletAmount },
                        $push: { walletTransactions: transaction },
                    }
                );
            } else {
                var response = await Users.updateOne(
                    { _id: new mongoose.Types.ObjectId(userId) },
                    {
                        $inc: { wallet: -walletAmount }
                    }
                );
            }

            resolve(response);
        } catch (err) {
            reject(err);
        }
    });
};


//--------------------------------------------------------------------------------------------------------------------------------

//generate order invoice
const generateInvoicePDF = async (orderData) => {
    const order = orderData[0]
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // Load an HTML template for your invoice
    const invoiceHTML = await ejs.renderFile('views/public/includes/invoice.ejs', { order });

    await page.setContent(invoiceHTML);

    // Generate PDF
    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
    });

    await browser.close();
    return pdfBuffer;
}



module.exports = {
    cancelOrder,
    makeOrder,
    emptyCart,
    updateWallet,
    findInvoiceOrder,
    generateInvoicePDF
}