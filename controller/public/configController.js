
require("dotenv").config()
const Users = require("../../models/public/userModel")
const Category = require("../../models/admin/categoryModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const nodemailer = require('nodemailer');
const mailgen = require("mailgen")
const jwtsecretKey = process.env.JWTSECRETKEY;
//get the twilio configuration
const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const verifySid = process.env.VERIFYSID;

const client = require("twilio")(accountSid, authToken);
const fromEmailId = process.env.EMAILID;
const emailPassword = process.env.EMAilPASSWORD;

//login
const login = async (req, res) => {
    try {
        const categoryData = await Category.find({})
        res.render("public/loginMobile", {categories : categoryData})
    } catch (error) {
        console.log(error.message)
    }
}

//login authenticate
const loginAuthenticate = async (req, res) => {
    try {
        
        const { emailId, loginPassword } = req.body
        //validate all fields
        if (!emailId) {
            return res.status(400).json({status : "error", msg : "Email Id Required"});
        } 
        else if(!loginPassword){
            return res.status(400).json({status : "error", msg : "Password Required"});
        }
        else 
        {
            const checkUser = await Users.findOne({email : emailId})
            if(!checkUser){
                return res.status(401).json({status : "error", msg : "username and password is incorrect"})
            }
            const checkPassword = await bcrypt.compare(loginPassword, checkUser.password)
            if(!checkPassword){
                return res.status(401).json({status : "error", msg : "username and password is incorrect"})
            }
            if(checkUser.blocked === true){
                return res.status(401).json({status : "error", msg : "User is temporarily blocked. Contact the web site owner for assistance"}) 
            }
            req.session.isloggedIn = true
            req.session.isauth = checkUser._id;
            req.session.email = checkUser.email;
            req.session.isBlocked = checkUser.blocked;
            req.session.userName = checkUser.firstName;
            res.status(200).json({status : "success", msg : "successfull login"})
        }
    } catch (error) {
        res.status(500).json({status : "error", msg : "Unable to login"})
    }
}

//show verify otp page
const verifyOtp = (req, res) => {
    try {
        const mobileNumber = req.query.userMobileNumber;
        res.render("public/otpPage", {mobile : mobileNumber})
    } catch (error) {
        res.status(500).render('public/errorPage', {msg : error.message})
    }
}

//validate otp
const validateOtp = async (req, res) => {
    try {
        const { otp , mobileNumber } = req.body;
        const getUser = await Users.findOne({phone : mobileNumber})
        if(!getUser){
            return res.status(403).json({status : "error", msg : "Unauthorozed User"})
        }
        if(getUser.blocked === true){
            return res.status(401).json({status : "error", msg : "User is temporarily blocked. Contact the web site owner for assistance"}) 
        }
        client.verify.v2
            .services(verifySid)
            .verificationChecks.create({ to: `+91${mobileNumber}`, code: otp })
            .then((verification_check) => {
                console.log(verification_check.status)
                if (verification_check.status === "approved") {
                    // console.log(verification_check);
                        req.session.isauth = getUser._id;
                        req.session.email = getUser.email;
                        req.session.isBlocked = getUser.blocked;
                        req.session.userName = getUser.firstName;
                    res.status(200).json({status : "success", msg : "OTP Verified"});
                } else {
                    res.status(400).json({status : "error", msg : "OTP Verification Failed"});
                }
            })
            .catch((err)=>{
                return res.status(500).json({status : "error", msg : "Unable to login"}) 

            })
    } catch (error) {
        return res.status(500).json({status : "error", msg : error.message}) 

    }
}

//validate the mobile number
const validateNumber = async (req, res) => {
    try {
        const { mobileNumber } = req.body
        const userData = await Users.findOne({phone : mobileNumber})
        if(!userData){
            return res.status(404).json({status : "error", msg : "Wrong Mobile Number"})
        }
        if(userData.blocked === true){
            return res.status(401).json({status : "error", msg : "User is temporarily blocked. Contact the web site owner for assistance"}) 
        }
        client.verify.v2
        .services(verifySid)
        .verifications.create({ to: `+91${mobileNumber}`, channel: "sms" })
        .then((verification) => {
            console.log(verification.status)
            res.json({status: "success", msg : 'number validated'})
        })
        .catch((err)=>{
            res.status(200).json({status : "error", msg : "Issue sending otp"})
        });
        
    } catch (error) {
        res.status(500).json({status : "error", msg : error.message})
    }
}

//fogot password authenticate
const forgotPassword = (req, res) => {
    try {
        res.render("public/forgotPassword.ejs")
    } catch (error) {
        console.log(error.message)
    }
}

//fogot password authenticate
const forgotPasswordAuth = async (req, res) => {
    try {
        console.log("haii")
        const {forgotEmail} = req.body
        const findUser = await Users.findOne({email : forgotEmail})
        if(!findUser){
            res.status(400).json({status : "error", msg : "User is not found"})
        }else{
            const newSecret = jwtsecretKey+findUser.password
            const payload = {
                email : findUser.email,
                id : findUser._id
            }
            const token = jwt.sign(payload, newSecret, {expiresIn : '5m'})
            const link = `http://localhost:3000/reset-password/${findUser._id}/${token}`;

            //send email
            // let testAccount = await nodemailer.createTestAccount()
            console.log(fromEmailId, emailPassword)
            const config = {
                service : "gmail",
                auth : {
                    user : fromEmailId,
                    pass : emailPassword
                }
            }

            const transporter = nodemailer.createTransport(config);

            let mailGenerator = new mailgen({
                theme : "default" ,
                product : {
                    name : "foodin",
                    link : "http://localhost:3000/"
                }
            })

            let response = {
                body : {
                    name : `${findUser.firstName}`,
                    intro : "Welcome to foodin! We\'re very excited to have you on board.",
                    action: {
                        instructions: 'To reset password , please click here:',
                        button: {
                            color: '#22BC66',
                            text: 'reset password',
                            link: link
                        }
                    },
                    outro : "looking forward to having buisness with you"
                }
            }

            let mail = mailGenerator.generate(response)
            // var emailText = mailGenerator.generatePlaintext(email);

            const message = {
                    from: fromEmailId, 
                    to: findUser.email, 
                    subject: "Reset password", 
                    html: mail, 
            }

            transporter.sendMail(message).then(()=>{
                res.status(201).json({status : "success", msg : "reset password email send", })  
            }).catch((err)=>{
                res.status(500).json({status : "error", msg : err.message })  
            })
        }
    } catch (error) {
        console.log(error.message)
    }
}

//fogot password authenticate
const resetPassword = async (req, res) => {
    try {
        const {id, token} = req.params
        const checkUser = await Users.findOne({_id : id})
        if(!checkUser){
            res.status(400).send("User is not found")
        }else{
                const secret = jwtsecretKey+checkUser.password
                const payload = jwt.verify(token, secret)
                if(!payload){
                    res.status(400).send("unauthorixed user")
                }else{
                    res.render("public/resetPassword", {email : checkUser.email})
                    // res.status(200).json({status : "status", msg : "User verified, reset the password"})
                }
        }
    } catch (error) {
        console.log(error.message)
    }
}

//fogot password authenticate
const resetPasswordAuth = async (req, res) => {
    try {
        const {password, confirmPassword, email} = req.body
        console.log(password, confirmPassword, email)
        if(password !== confirmPassword){
            res.status(400).json({status : "error", msg : "password does not match"})
        }else{
            const hashedPassword = await bcrypt.hash(password, 12)
            const updatePassword = await Users.updateOne({email},{$set : {password : hashedPassword}})
            if(!updatePassword){
                res.status(500).json({status : "error", msg : "cannot update password at the moment"})
            }else{
                res.status(200).json({status : "success", msg : "password updated"})
            }
        }
    } catch (error) {
        console.log(error.message)
    }
}

//signup 
const signup = async (req, res) => {
    try {
        const categoryData = await Category.find({})
        res.render("public/signup", {categories : categoryData})
    } catch (error) {
        console.log(error.message)
    }
}

//signup authenticate
const signupAuthenticate = async (req, res) => {
    try {
        const { firstName, lastName, emailId, mobileNumber, signupPassword, confirmPassword } = req.body
        //validate all fields
        if (!firstName) {
            return res.status(400).render("public/signup", {status : "error", msg : "first name Required"});
        } 
        else if(!lastName){
            return res.status(400).render("public/signup", {status : "error", msg : "Last name Required"});
        }
        else if(!emailId){
            return res.status(400).render("public/signup", {status : "error", msg : "Email Required"});
        }
        else if(!mobileNumber){
            return res.status(400).render("public/signup", {status : "error", msg : "Mobile Number Required"});
        }
        else if(!signupPassword){
            return res.status(400).render("public/signup", {status : "error", msg : "Password Required"});
        }
        else if(!confirmPassword){
            return res.status(400).render("public/signup", {status : "error", msg : "Confirm Password Required"});
        }
        else 
        {
            const checkUser = await Users.findOne({$or : [{email : emailId}, {phone : mobileNumber}]})
            if(checkUser){
                return res.status(409).render("public/signup", { status : "error", msg : "User already exist, login to your account" });
            }else{
                if (signupPassword === confirmPassword) {
                    const strongPassword = await bcrypt.hash(signupPassword, 12)
                    const newUser = new Users({
                        firstName: firstName,
                        lastName: lastName,
                        email: emailId,
                        phone: mobileNumber,
                        password: strongPassword,
                        isVarified: false,
                        blocked : false,
                        wallet : 0
                    })
                    await newUser.save()
                    .then(() => {
                        // req.session.isAuth = true
                        res.status(200).render("public/signup", {status : "success", msg : "Registation SuccessFull"})
                    }).catch((err) => {
                        console.log(err.message)
                        res.status(500).render("public/signup", {status : "error", msg : "Can't resgister at the moment"})
                    })
                } else {
                    return res.status(400).render("public/signup", {status : "error", msg : "Password does not match"});
                }
            }
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).render("public/signup", {status : "error", msg : "internal server error"})
    }
}

const logOut = (req,res)=>{
    try {
        req.session.destroy((err)=>{
            if(err){
                console.log(err.message)
            }else{
                res.redirect("/login")
            }
        })
    } catch (error) {
        console.log(error.message)
    }
}


module.exports = {
    login,
    loginAuthenticate,
    forgotPassword,
    forgotPasswordAuth,
    resetPassword,
    resetPasswordAuth,
    signup,
    signupAuthenticate,
    logOut,
    verifyOtp,
    validateOtp,
    validateNumber
}