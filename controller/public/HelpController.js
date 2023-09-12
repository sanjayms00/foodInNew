const helpSupport = require("../../models/public/HelpSupportModel")
const Users = require("../../models/public/userModel")


//-----------------------------------------------------------------------------------------------------

//load help page
const loadPage = (req, res) => {
    try {
        res.status(200).render("public/help")
    } catch (error) {
        res.status(500).render("public/errorPage", {msg : "Something went wrong."})
    }
}


//-----------------------------------------------------------------------------------------------------

//save the user issue
const saveIssue = async (req, res) => {
    try {
        const {issue} = req.body;
        const userId = req.session.isauth
        if(userId === undefined){
            return res.status(200).json({status : 'login', msg : "Please Login"})
        }
        const data = new helpSupport({
            issue : issue,
            userId : userId
        })
        //save the data
        await data.save()
        res.status(200).json({status : 'success', msg : "Issue addressed"})
    } catch (error) {
        res.status(500).json({status : 'error', msg : error.message})
    }
}


//-----------------------------------------------------------------------------------------------------

//export all functions
module.exports = {
    loadPage,
    saveIssue
}