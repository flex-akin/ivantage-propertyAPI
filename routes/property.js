const express = require("express")
const router = express.Router()
const { getProperty, postProperty, getSingleProperty, deleteProperty, editProperty, findProperty,  } = require('../controllers/propertyController')

// GET
router.route('/property').get(getProperty);
router.route('/getsingleproperty').get(getSingleProperty)
router.route('/findproperty').get(findProperty)


//POST 
router.route('/addproperty').post(postProperty)

// DELETE
router.route('/deleteproperty').delete(deleteProperty)

//UPDATE
router.route('/editproperty').patch(editProperty)


module.exports = router


