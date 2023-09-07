require('dotenv').config()
const express = require("express")
const app = express();
const path = require("path")
//connect to database
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABSE_URL,{useNewUrlParser : true,  useUnifiedTopology : true})
.then(()=>{
    console.log("mongodb connected")
}).catch((err)=>{
    console.log(err)
})
// mongoose.set('debug', true)
const nocache = require("nocache")
//get port from environment variables
const PORT = process.env.PORT || 3001;

//view engine, views settinng
app.set('view engine', "ejs");
app.set("views","./views")
app.set('layout', 'admin/layout');

//serve static files
app.use(express.static(path.join(__dirname, 'views/public')));
app.use(express.static(path.join(__dirname, 'views/admin')));
app.use(express.static(path.join(__dirname, 'views/uploads')));


app.use(express.urlencoded({extended : true}))
app.use(express.json())

//public and admin routes
const publicRoute = require("./routes/public/publicRoute")
const adminRoute  = require("./routes/admin/adminRoute")

app.use(nocache())
app.use("/",publicRoute);
app.use("/admin",adminRoute)

// handle 404 page not found
app.use("*",(req,res,next)=>{
    res.status(404).render("public/pageNotFound", {layout : false})
})

app.listen(PORT,()=>{
    console.log(`foodin is running : http://127.0.0.1:${PORT}`)
})