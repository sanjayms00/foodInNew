const Banner = require('../../models/admin/bannerModel')
const Food = require('../../models/admin/foodModel')
const sharp = require("sharp")
const fs = require("fs")
const path = require('path')
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose')

//banner page showing
const showBanner = async (req, res) => {
    //get banner data
    await Banner.find({}).sort({position : 1})
    .then((data)=>{
        res.render('admin/banner/index', {banner : data})
    })
    .catch((err)=>{
        res.render('public/errorPage', {msg : "Something went Wrong"})
    })
}

//banner creation
const createBanner = async (req, res) => {
    //get banner data
    await Food.find({status : true},{foodName : 1, slug : 1, })
    .then((data)=>{
        res.render('admin/banner/create', {food : data})
    })
    .catch((err)=>{
        // res.render('public/errorPage', {msg : err.message})
        res.render('public/errorPage', {msg : "Something went Wrong"})
    })
}

//banner creation
const editBanner = async (req, res) => {
    //get banner data
    const id = new mongoose.Types.ObjectId(req.query.id);
    const bannerData = Banner.find({_id : id})
    const foodData =  Food.find({status : true},{foodName : 1, slug : 1, })
    await Promise.all([bannerData, foodData])
    .then((response)=>{
      res.render('admin/banner/edit', {banner : response[0], food : response[1]})
    }).catch((error)=>{
      res.render('pubic/errorPage', {msg : 'Issue loading the page'})
    })
}

const saveBanner = async (req, res) => {
    try {
        const {bannerDescription, productUrl, bannerName} = req.body;

        const base64Image = req.body.croppedImage;
        const dataStartIndex = base64Image.indexOf(',') + 1;
        const imageBinaryData = base64Image.substring(dataStartIndex);
        // Decode the base64 data
        const decodedImage = Buffer.from(imageBinaryData, 'base64');
        // Update with your directory
        const uploadDirectory = "./views/uploads/banner"; 
        // Update with your desired extension
        const fileExtension = '.jpg'; 
        const newFileName = `${uuidv4()}${fileExtension}`;
        const filePath = path.join(uploadDirectory, newFileName);

        // Make the directory if it doesn't exist
        if (!fs.existsSync(uploadDirectory)) {
          fs.mkdirSync(uploadDirectory, { recursive: true });
        }
        fs.writeFileSync(filePath, decodedImage);

        const newBanner = new Banner({
          image: newFileName,
          url: productUrl,
          heading : bannerName,
          description: bannerDescription,
          status: true
        });

        await newBanner.save()
        .then((data)=>{
            res.status(200).json({ status: "success", msg: "Banner Created" });
        })
      } catch (error) {
        res.status(500).json({ status: "error", msg: "Food creation failed" });
      }
}

//update Banner
const updateBanner = async (req, res) => {
  try {
    const {croppedImage, bannerId, prevImage, bannerDescription, productUrl, bannerName} = req.body

    //split image
    const parts = croppedImage.split('/banner/');
    const fileName = parts[1];

    //work if they match
    if(fileName !== prevImage){
      const base64Image = req.body.croppedImage;
      const dataStartIndex = base64Image.indexOf(',') + 1;
      const imageBinaryData = base64Image.substring(dataStartIndex);

      // Decode the base64 data
      const decodedImage = Buffer.from(imageBinaryData, 'base64');

      // Update with your directory
      const uploadDirectory = "./views/uploads/banner"; 

      // Update with your desired extension
      const fileExtension = '.jpg'; 
      var newFileName = `${uuidv4()}${fileExtension}`;
      const filePath = path.join(uploadDirectory, newFileName);

      // Make the directory if it doesn't exist
      if (!fs.existsSync(uploadDirectory)) {
        fs.mkdirSync(uploadDirectory, { recursive: true });
      }
      fs.writeFileSync(filePath, decodedImage);
      const prevImagePath = path.join(uploadDirectory, prevImage);

      // Check if the file exists before attempting to delete
      if (fs.existsSync(prevImagePath)) 
      {
          // Delete the file
          fs.unlinkSync(prevImagePath);
          //console.log(`Image ${prevImage} deleted successfully.`);
      } else {
          return res.status(404).json({status : "error", msg : 'Image not found'});
      }
    }
    const updateBanner = {
        image: (newFileName === null) ? prevImage : newFileName,
        url: productUrl,
        heading : bannerName,
        description: bannerDescription,
        status: true
      
    };
    await Banner.updateOne({ _id: bannerId},{$set : updateBanner})
    .then((response)=>{
      res.status(200).json({ status: "success", msg: "updated Banner Successfully" });
    })

  } 
  catch (error) {
    res.status(500).json({ status: "error", msg: "Banner creation failed" });
  }
}

//delete Banner
const deleteBanner = async (req,res)=>{
  try {
    const id = new mongoose.Types.ObjectId(req.body.id)
    const image = req.body.image

    //attempt delete
    await Banner.deleteOne({_id : id})
    .then((response) => {
      const uploadDirectory = "./views/uploads/banner";
      const prevImagePath = path.join(uploadDirectory, image);
      // Check if the file exists before attempting to delete
      if (fs.existsSync(prevImagePath)) 
      {
          
          // Delete the file
          fs.unlinkSync(prevImagePath);
          return res.status(200).json({status : "success", msg : "Banner Deleted"})
          //console.log(`Image ${prevImage} deleted successfully.`);
      }
    })
  } 
  catch (error) {
    res.status(500).json({status : "error", msg : error.message})
  }
}

//chnage status
const changeStatus = async (req, res) => {
  try {
    const {orderId, status} = req.body
    await Banner.updateOne({_id : new mongoose.Types.ObjectId(orderId)}, {$set : {status : status}})
    .then((response)=>{
        return res.status(200).json({status : "success", msg : "Status Changed", btnStatus: status})
    })
  } catch (error) {
    res.status(500).json({status : "error", msg : errorMonitor.message})
  }
}

//chnage status
const changePosition = async (req, res) => {
  try {
    const {id, value} = req.body
    await Banner.updateOne({_id : new mongoose.Types.ObjectId(id)}, {$set : {position : value}})
    .then((response)=>{
        return res.status(200).json({status : "success", msg : "Position Changed"})
    })
  } catch (error) {
    res.status(500).json({status : "error", msg : errorMonitor.message})
  }
}


module.exports = {
    showBanner,
    createBanner,
    saveBanner,
    updateBanner,
    editBanner,
    deleteBanner,
    changeStatus,
    changePosition
}