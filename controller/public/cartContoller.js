const Cart = require("../../models/public/cartModel");
const Foods = require('../../models/admin/foodModel')
const mongoose = require("mongoose")
const cartHelper = require('../../helper/cartHelper')



//get cart total
async function getCartTotal(userId){
  const cartTotal = await Cart.aggregate([
    {
      $match: { userId: new mongoose.Types.ObjectId(userId) }
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
  ]);
  return cartTotal
}

//get cart items
async function getCartItems(userId){
  //console.log("user id:"+userId)
  const cartItems = await Cart.aggregate([
    {
      $match: {userId: new mongoose.Types.ObjectId(userId)}
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
    }
  ]);
  return cartItems
  //console.log(cartItems)
}

//show cart
const showCart = async (req, res) => {
  try {
    const userId = req.session.isauth;
    //console.log(userId)
    if (!userId) {
      res.render("public/errorPage", {msg : "No user found"});
      return
    } else {
        const cart = await getCartItems(userId)
        const cartTotal = await getCartTotal(userId);
        res.render("public/cart", { cart, cartTotal });
      }
  } catch (error) {
    res.render("public/errorPage", {msg : "Cart Not Available"});
  }
};

//delete cart Item
const deleteCartItem = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.session.isauth);
    const foodId = new mongoose.Types.ObjectId(req.body.foodId);

    if (!userId) {
      return res.status(400).json({ status: "error", msg: "user not found" });
    }
    const result = await Cart.updateOne(
      { userId: userId },
      { $pull: { items: { foodId } } }
    );
    if (result.modifiedCount > 0) {
      return res.status(200).json({ status: "success", msg: "item deleted successfully" });
    } else {
      return res.status(200).json({ status: "error", msg: "failed to delete the item from cart" });
    }
  } catch (error) {
    return res.status(500).json({ status: "error", msg: error.message });
  }
};

//add to cart
const addToCart = async (req, res) => {
    try {
      
      if(!req.session.isauth){
        return  res.status(404).json({status : "no-user", msg : "User not Found"})
      }
      const userId = new mongoose.Types.ObjectId(req.session.isauth)
      const foodId = req.body._id;
      const foodPrice = req.body.discPrice;
      const totalStock = req.body.totalStock;
      
      const CheckStock = await Foods.find({_id : new mongoose.Types.ObjectId(foodId)}, {totalStoke : 1})
      if(CheckStock[0].totalStoke < 1){
        return res.status(404).json({status : "error", msg : "Out of Stock"})
      }
      const findUser = await Cart.findOne({userId})
      if(!findUser){
        const newUser = new Cart({
          userId : req.session.isauth,
          items : [],
          subTotal : 0
        })
        newUser.save()
      }
      //check existing item
      const existingItem = await Cart.findOne({
        userId: req.session.isauth,
        'items.foodId': foodId,
      });
      console.log(existingItem)
      if (!existingItem) {
        await Cart.updateOne({userId : req.session.isauth}, { $push: { items: {foodId : foodId, quantity : 1, total : foodPrice} } });
        const cart = await Cart.findOne({ userId: req.session.isauth });
        if (cart) {
            return res.status(200).json({status : "success", length : cart.items.length, msg : 'Food added to cart successfully'})
        }
      }else{
        return res.json({status : "error", msg : "Already added to Cart"})
      }
      res.status(200).json({status : "success", msg : "Food added to Cart"})
    } catch (error) {
      res.status(500).json({status : "error", msg : error.message})
    }
};

const updateCartByQuantity = async (req, res) => {
  try {
    let { foodId, foodPrice, qty, stat, stock} = req.body;
    const foodIdAsObjectId = new mongoose.Types.ObjectId(foodId);
    const userId = new mongoose.Types.ObjectId(req.session.isauth);

    if (!userId) {
      return res.status(400).json({ status: "error", msg: "user not found" });
    }
    const findUser = await Cart.findOne({ userId: userId });
    if (!findUser) {
      return res.status(400).json({ status: "error", msg: "user not found" });
    }

    if(qty < 1){
      await Cart.updateOne(
        { userId: userId },
        { $pull : { items :{ foodId : foodIdAsObjectId} }}
        );
      return res.status(400).json({ removed : true });
    }

    const result =  await Cart.updateOne(
        { userId: userId, "items.foodId": foodIdAsObjectId },
        { $inc : { "items.$.quantity": stat, "items.$.total" : foodPrice}},
        {new : true}
      );

    const cartData = Cart.aggregate([
      {
        $match: { userId, "items.foodId": foodIdAsObjectId }
      },
      {
        $addFields: {
          foodItems: {
            $filter: {
              input: "$items",
              as: "item",
              cond: { $eq: ["$$item.foodId", foodIdAsObjectId] }
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
            foodId: { $arrayElemAt: ["$foodItems.foodId", 0] },
            quantity: { $arrayElemAt: ["$foodItems.quantity", 0] },
            total: { $arrayElemAt: ["$foodItems.total", 0] }
        }
      }
    ]);
    const subTotal = getCartTotal(req.session.isauth)
    const foodStock = cartHelper.totalStock(foodIdAsObjectId)
    Promise.all([cartData, subTotal, foodStock]).then((response)=>{
      res.json({ status: "success", msg: "Cart updated successfully", items: response[0], subTotal : response[1], foodStock : response[2]});
    })
  } catch (error) {
    res.status(500).json({ status: "error", msg: error.message });
  }
};



module.exports = {
  addToCart,
  showCart,
  deleteCartItem,
  updateCartByQuantity
};
