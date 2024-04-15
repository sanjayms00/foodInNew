const AdminUsers = require('../../models/admin/adminModel')
const bcrypt = require('bcryptjs')

//-----------------------------------------------------------------------------

//load admin dashboard
const admin = (req, res) => {
    try {
        if (req.session && req.session.adminUser) {
            res.redirect("/admin/dashboard")
        } else {
            res.redirect("/admin/login")
        }
    } catch (error) {
        res.render("admin/errorPage", { msg: error.message })
    }
}


//-----------------------------------------------------------------------------

//load admin login
const login = (req, res) => {
    try {
        if (req.session && req.session.adminUser) {
            res.redirect("/admin/dashboard")
        } else {
            res.render("admin/adminlogin", { layout: false })
        }
    } catch (error) {
        res.render("admin/errorPage", { msg: error.message })
    }
}


//-----------------------------------------------------------------------------

//load admin signup
const signUp = (req, res) => {
    try {
        if (req.session && req.session.adminUser) {
            res.redirect("/admin/dashboard")
        } else {
            res.render("admin/adminSignUp", { layout: false })
        }
    } catch (error) {
        res.render("admin/errorPage", { msg: error.message })
    }
}

//-----------------------------------------------------------------------------

//authenticate the admin user credentials
const authSignUp = async (req, res) => {
    try {

        //get admin sign up input data
        const { name, email, password, confirmPassword } = req.body

        if (!name || !email || !password || !confirmPassword) {
            throw new Error("fill out the fields")
        }

        //check admin exist
        const user = await AdminUsers.findOne({ email })

        console.log(user)

        if (user) {
            throw new Error("User already exist")
        }

        const strongPassword = await bcrypt.hash(password, 12)

        //save
        const newAdminUser = new AdminUsers({
            name,
            email,
            password: strongPassword,
            isVarified: true
        });

        const result = await newAdminUser.save()

        if (!result) {
            throw new Error(result)
        }

        req.session.adminUser = true;

        res.json({ status: 'success', msg: "Admin creation successful" })

    }
    catch (error) {
        res.status(500).json({ status: "error", msg: error.message })
    }
}


//-----------------------------------------------------------------------------

//authenticate the admin user credentials
const auth = async (req, res) => {
    try {
        //get admin input data
        const { adminEmail, adminPassword } = req.body

        //check the user
        const checkAdmin = await AdminUsers.findOne({ email: adminEmail })
        if (!checkAdmin) {
            return res.status(400).json({ status: "error", msg: "Wrong Email or Password" })
        }

        //compare the password
        const checkPassword = await bcrypt.compare(adminPassword, checkAdmin.password)
        if (!checkPassword) {
            return res.status(400).json({ status: "error", msg: "Wrong Email or Password" })
        }
        req.session.adminUser = true;
        res.status(200).json({ status: "success", msg: "Login Successful" })
    }
    catch (error) {
        res.status(500).json({ status: "error", msg: error.message })
    }
}


//-----------------------------------------------------------------------------

//logout
const logout = (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
            } else {
                res.render("admin/adminlogin.ejs", { layout: false })
            }
        })
    } catch (error) {
        res.render("admin/errorPage", { msg: error.message })
    }
}


//-----------------------------------------------------------------------------

//exporting the functions
module.exports = {
    admin,
    login,
    auth,
    signUp,
    authSignUp,
    logout,

}