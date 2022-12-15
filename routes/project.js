const express = require("express")
const router = express.Router()
const { postProject } = require('../controllers/projectController')

router.route('/addproject').post(postProject)

module.exports = router
