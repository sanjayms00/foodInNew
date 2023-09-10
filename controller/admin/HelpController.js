const helpSupport = require('../../models/public/HelpSupportModel')

const loadPage = async (req, res) => {
    try {
        const helpData = await helpSupport.find({})
        res.status(200).render("admin/help/index", {data : helpData})
    } catch (error) {
        res.status(500).render("admin/errorPage", {msg : "Something went wrong."})
    }
}

module.exports = {
    loadPage
}