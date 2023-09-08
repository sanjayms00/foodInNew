const Foods = require("../../models/admin/foodModel")
const Orders = require("../../models/admin/ordersModel") 
const mongoose = require('mongoose')


const rate = async (req, res) => {
    try {
       
        const userId = req.session.isauth;
        const { rating} = req.body;
        let orderId;
        // Iterate through the food items to update their ratings
        for (const foodId in rating) {
            if(foodId === 'orderId') {
                orderId = rating[foodId]
                continue
            }   

            const rate = {
                userId : userId,
                value: rating[foodId],
            };

            const id = new mongoose.Types.ObjectId(foodId)

            await Foods.updateOne(
                { _id: id},
                { $push: { rating: rate } }
            );
        }
        console.log("orderId :", orderId)
        // Update the order's rated status
        const updatedOrder = await Orders.updateOne(
            { _id: new mongoose.Types.ObjectId(orderId) },
            { $set: { rated: true } }
        );

        res.status(200).json({ status: "success", msg: "Rating Added" });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ status: "error", msg: error.message });
    }
};


module.exports = {
    rate
}