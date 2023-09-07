const Foods = require("../../models/admin/foodModel")
const Orders = require("../../models/admin/ordersModel") 
const mongoose = require('mongoose')


const rate = async (req, res) => {
    try {
        // Get user ID from the session
        const userId = req.session.isauth;

        // Extract rating and orderId from the request body
        const { rating, orderId } = req.body;
        console.log(userId)
        // Iterate through the food items to update their ratings
        for (const foodId in rating) {
            const rate = {
                userId : userId,
                value: rating[foodId],
            };

            const id = rating[foodId]
            console.log(id)
            // Check if the provided foodId is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ status: "error", msg: "Invalid food item ID" });
            }

            // Update the food item's rating using $push
            const updatedFood = await Foods.updateOne(
                { _id: new mongoose.Types.ObjectId(id) },
                { $push: { rating: rate } }
            );

            if (updatedFood.nModified === 0) {
                return res.status(404).json({ status: "error", msg: "Food item not found" });
            }
        }

        // Update the order's rated status
        const orderIdNew = new mongoose.Types.ObjectId(orderId)
        const updatedOrder = await Orders.updateOne(
            { _id: orderIdNew },
            { $set: { rated: true } }
        );

        if (updatedOrder.nModified === 0) {
            return res.status(404).json({ status: "error", msg: "Order not found" });
        }

        res.status(200).json({ status: "success", msg: "Rating Added" });
    } catch (error) {
        res.status(500).json({ status: "error", msg: error.message });
    }
};


module.exports = {
    rate
}