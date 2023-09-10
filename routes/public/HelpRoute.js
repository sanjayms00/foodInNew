const express = require('express')
const helpRouter = express.Router()

//controller
const helpController = require('../../controller/public/HelpController')

helpRouter.get('/', helpController.loadPage)
helpRouter.post('/send-issue', helpController.saveIssue)

module.exports = helpRouter