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
        res.render("public/errorPage", {msg : error.message})
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
        res.render("public/errorPage", {msg : error.message})
    }
}

//authenticate the admin user credentials
const auth = async(req,res) => {
    try {
        //get admin data
        const {adminEmail, adminPassword } = req.body 
        //check the user
        const checkAdmin = await AdminUsers.findOne({email : adminEmail})
        if(!checkAdmin){
            // res.status(400).json({status : "error" , msg : "Wrong Email or Password"})
            throw new Error('Wrong Email or Password')
        }
        const checkPassword = await bcrypt.compare(adminPassword, checkAdmin.password)
        if(!checkPassword){
            throw new Error('Wrong Email or Password')
            //return res.status(400).json({status : "error" , msg : "Wrong Email or Password"})
        }
        req.session.adminUser = true;
        res.status(200).json({status : "success", msg : "Login Successful"})
    } 
    catch (error) {
        // res.status(500).json({msg : error.message})
        res.json({status : "error", msg : error.message})
    }
}

const logout  = (req,res) => {
    try {
        req.session.destroy((err) => {
            if(err){
                console.error('Error destroying session:', err);
            }else{
                res.render("admin/adminlogin.ejs", {layout : false, status : "success" , msg : "Logout successfull"})
            }
        })
    } catch (error) {
        res.render("public/errorPage", {msg : error.message})
    }
}

module.exports = {
    admin,
    login,
    auth,
    logout
}