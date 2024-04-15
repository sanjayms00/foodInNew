const Users = require('../../models/public/userModel')
const mongoose = require('mongoose');


//-----------------------------------------------------------------------------------------------------

//load wishlist 
const loadWishlist = async (req, res) => {
  try {
    const userId = req.session.isauth;
    if (!userId) {
      res.render("public/errorPage", {msg : "No user found"});
      return
    } else {
        //get all wishlist data
        
        const wishlist = await Users.aggregate([
          { $match: { _id: new mongoose.Types.ObjectId(userId) } },
          { $unwind: '$wishlist' },
          {
            $lookup: {
              from: 'foods', // Replace with the name of the food collection
              localField: 'wishlist.foodId',
              foreignField: '_id',
              as: 'foodData'
            }
          },
          { $project: { foodData: 1 } } 
        ]);
        
        res.render("public/wishlist", { wishlist });
      }
  } 
  catch (error) 
  {
    res.render("public/errorPage", {msg : error.message});
  }
};


//-----------------------------------------------------------------------------------------------------

//load wishlist 
const addToWishlist = async (req, res) => {
    try {

      console.log(req.body)

      if(!req.session.isauth)
      {
        return  res.status(404).json({status : "no-user", msg : "User not Found"});
      }

      const userId = new mongoose.Types.ObjectId(req.session.isauth)
      const foodId = req.body._id;
      
      //check food in wishlist
      const userData = await Users.find({
        _id: userId,
        wishlist : { $elemMatch: { foodId: foodId }}
      });
      
      if(userData.length < 1){
        const data = {foodId : new mongoose.Types.ObjectId(foodId)}
        //push data
        await Users.updateOne(
          {_id : userId},
          {$push : {wishlist : data}}
        );

        // Fetch the updated document
        const updatedDocument = await Users.findOne({ _id: userId }, {wishlist : 1});
        // Get the length of the wishlist array
        const wishlistLength = updatedDocument.wishlist.length;
        res.status(200).json({status : "success", wishlistLength,  msg : "Food added to Wishlist"})
      }else{
        //already added
        res.status(200).json({status : "error", msg : "Already added to wishlist"})
      }
    } 
    catch (error) 
    {
      res.status(500).json({status : "error", msg : error.message})
    }
};


//-----------------------------------------------------------------------------------------------------

//delete wishlist
const deleteWishlist = async (req, res) => {
  try {
    if(!req.session.isauth)
      {
        return  res.status(404).json({status : "no-user", msg : "User not Found"});
      }

      const userId = new mongoose.Types.ObjectId(req.session.isauth)
      const {  wishlistId } = req.body
      
      await Users.updateOne(
        {_id : userId}, 
        {$pull : {wishlist : {foodId : new mongoose.Types.ObjectId(wishlistId)}}})

      res.status(200).json({status : "success", msg : "Wishlist deleted"})
  } 
  catch (error) 
  {
    res.status(500).json({status : "error", msg : error.message})
  }
}


//-----------------------------------------------------------------------------------------------------

//export all functions
module.exports = {
    loadWishlist,
    addToWishlist,
    deleteWishlist
}