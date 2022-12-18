const express = require("express")
const router = express.Router()
const { postProject, getAllProjectName, getAllProject } = require('../controllers/projectController')

// GET
router.route('/individualprojectnames').get(getAllProjectName)
router.route('/allprojectnames').get(getAllProject)


// POST
router.route('/addproject').post(postProject)

module.exports = router
