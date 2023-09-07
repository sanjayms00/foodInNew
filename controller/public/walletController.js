const Users =  require("../../models/public/userModel")
const mongoose = require('mongoose')

//show wallet
const wallet = async (req, res) => {
    try {
        const userId = req.session.isauth
        if(!userId){
            res.render("public/errorPage", {msg : "No user found"});
        }
        const data = await Users.find({_id : new mongoose.Types.ObjectId(userId)}, {wallet : 1, walletTransactions : 1})
        //console.log(data[0].wallet)
        res.render('public/wallet', {data})
    } catch (error) {
        res.render("public/errorPage", {msg : "Something went wrong!"});
    }
}

module.exports = {
    wallet
}
