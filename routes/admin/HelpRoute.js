const express = require('express');
const helpRoute = express.Router();

const helpController = require('../../controller/admin/HelpController.js')

helpRoute.get('/', helpController.loadPage)

module.exports = helpRoute