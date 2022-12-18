const express = require("express")
const router = express.Router()
const { getProperty, postProperty, getSingleProperty } = require('../controllers/propertyController')

// GET
router.route('/property').get(getProperty);
router.route('/getsingleproperty').get(getSingleProperty)


//POST 
router.route('/addproperty').post(postProperty)


module.exports = router


