const AdminUsers = require("../../models/admin/adminModel")
const bcrypt = require("bcryptjs")

const admin = (req,res) => {
    try {
        if (req.session && req.session.adminUser) {
            res.redirect("/admin/dashboard")
        } else {
            res.redirect("/admin/login")
        }
    } catch (error) {
        console.log(error.message)
    }
}

const login = (req,res) => {
    
    try {
        if (req.session && req.session.adminUser) {
            res.redirect("/admin/dashboard")
        } else {
            res.render("admin/adminlogin",{layout : false})
        }
        
    } catch (error) {
        console.log(error.message)
    }
}

const auth = async(req,res) => {
    try {
        //logic
        const {adminEmail, adminPassword } = req.body 
        const checkAdmin = await AdminUsers.findOne({email : adminEmail})
        if(!checkAdmin){
            return res.render("admin/adminLogin", {layout : false, status : "error" , msg : "Email id or password is incorrect"})
        }
        const checkPassword = await bcrypt.compare(adminPassword, checkAdmin.password)
        if(!checkPassword){
            return res.render("admin/adminLogin", {layout : false, status : "error" , msg : "Email id or password is incorrect"})
        }
        req.session.adminUser = true;
        res.redirect("/admin/dashboard")
    } catch (error) {
        console.log(error.message)
    }
}

const logout  = (req,res) => {
    try {
        req.session.destroy((err) => {
            if(err){
                console.error('Error destroying session:', err);
            }else{
                res.render("admin/adminLogin", {layout : false, status : "success" , msg : "Logout successfull"})
            }
        })
    } catch (error) {
        
    }
}

module.exports = {
    admin,
    login,
    auth,
    logout
}