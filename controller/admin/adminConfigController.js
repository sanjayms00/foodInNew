const AdminUsers = require("../../models/admin/adminModel")
const bcrypt = require("bcryptjs")


//-----------------------------------------------------------------------------

//load admin dashboard
const admin = (req,res) => {
    try {
        if (req.session && req.session.adminUser) {
            res.redirect("/admin/dashboard")
        } else {
            res.redirect("/admin/login")
        }
    } catch (error) {
        res.render("admin/errorPage", {msg : error.message})
    }
}


//-----------------------------------------------------------------------------

//load admin login
const login = (req,res) => {
    try {
        if (req.session && req.session.adminUser) {
            res.redirect("/admin/dashboard")
        } else {
            res.render("admin/adminlogin",{layout : false})
        }  
    } catch (error) {
        res.render("admin/errorPage", {msg : error.message})
    }
}


//-----------------------------------------------------------------------------

//authenticate the admin user credentials
const auth = async(req,res) => {
    try {
        //get admin input data
        const {adminEmail, adminPassword } = req.body 

        //check the user
        const checkAdmin = await AdminUsers.findOne({email : adminEmail})
        if(!checkAdmin){
            return res.status(400).json({status : "error" , msg : "Wrong Email or Password"})
        }

        //compare the password
        const checkPassword = await bcrypt.compare(adminPassword, checkAdmin.password)
        if(!checkPassword){
            return res.status(400).json({status : "error" , msg : "Wrong Email or Password"})
        }
        req.session.adminUser = true;
        res.status(200).json({status : "success", msg : "Login Successful"})
    } 
    catch (error) {
        res.status(500).json({status : "error", msg : error.message})
    }
}


//-----------------------------------------------------------------------------

//logout
const logout  = (req,res) => {
    try {
        req.session.destroy((err) => {
            if(err){
                console.error('Error destroying session:', err);
            }else{
                res.render("admin/adminlogin.ejs", {layout : false})
            }
        })
    } catch (error) {
        res.render("admin/errorPage", {msg : error.message})
    }
}


//-----------------------------------------------------------------------------

//exporting the functions
module.exports = {
    admin,
    login,
    auth,
    logout
}