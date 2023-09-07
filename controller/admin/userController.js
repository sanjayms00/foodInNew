const Users = require("../../models/public/userModel")

const showusers = async (req,res)=>{
    try {
        const userData = await Users.find({})
        res.status(200).render("admin/users", {data : userData})
    } catch (error) {
        console.log(error.message)
    }
}
const userStatus = async (req,res)=>{
    try {
        
        const {userId, status} = req.body
        const updateStatus = await Users.updateOne({_id : userId}, {$set : {blocked : status === "true"}})
        if(!updateStatus){
            return res.status(400).json({status : "error", msg : "Status Updation Failed"})
        }
        res.status(200).json({status : "success", msg : "Status Updated"})
    } catch (error) {
        return res.status(400).json( {status : "error", msg : "Unable to change the status"})
    }
}

//export all functions like objects
module.exports = {
    showusers,
    userStatus
}