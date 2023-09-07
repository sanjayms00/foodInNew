const Razorpay = require('razorpay');


//create razorpay instance
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

//generate razorpay order
const generateRazorPay = (orderId, price) =>{
    return new Promise((resolve, reject)=>{
        var options = {
            amount: price*100,
            currency: "INR",
            receipt: orderId.toString()
          };
          instance.orders.create(options, function(err, order) {
            if(err){
                reject(err)
            }
            resolve(order)
          });
    })
}


const verifyRazorPayPayment = (response, order) => {
    return new Promise((resolve, reject)=>{
        const crypto = require('crypto')
        const hash = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
               .update(response.razorpay_order_id+"|"+response.razorpay_payment_id)
               .digest('hex');
               if (hash == response.razorpay_signature) {
                resolve()
              }else{
                reject()
              }
    })
}



module.exports = {
    generateRazorPay,
    verifyRazorPayPayment
}