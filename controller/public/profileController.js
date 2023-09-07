const Users = require("../../models/public/userModel")


const myProfile = async (req, res) => {
    try {
        const userId = req.session.isauth
        if(!userId){
            res.render("public/errorPage", {msg : "Can not load profile page"})
        }else{
            const userData = await Users.findOne({_id : userId})
            if(!userData){
                res.render("public/errorPage", {msg : "Profile details is not found"})
            }
            res.render("public/myProfile", {data : userData})
        }
    } catch (error) {
        res.render("public/errorPage", {msg : error.message})
    }
}

const editProfile = async (req, res) => {
    try {
        const userId = req.session.isauth
        if(!userId){
            res.render("public/errorPage", {msg : "Can not load profile page"})
        }else{
            const userData = await Users.findOne({_id : userId})
            if(!userData){
                res.render("public/errorPage", {msg : "Profile details is not found"})
            }
            res.render("public/editProfile", {data : userData})
        }
    } catch (error) {
        
    }
}

const updateProfile = async (req, res) => {
    try {
        const {fName, lName, emailId, phoneNumber, userId} = req.body;
        const updateUser = await Users.updateOne({_id : userId}, {$set : {firstName : fName, lastName : lName, email : emailId, phone : phoneNumber}})
        if(!updateUser){
            res.status(400).json({status : "error", msg : "can not update profile details"})
        }else{
            req.session.userName = fName
            res.status(200).json({status : "success", msg : "profile updated successfully"})
        }
    }
    catch (error) {
            
    }
}

module.exports = {
    myProfile,
    editProfile,
    updateProfile
}