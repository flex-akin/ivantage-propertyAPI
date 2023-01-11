const express = require("express")
const router = express.Router()
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const { uploadS3 } = require('../helpers/multers3');
const { getProperty, postProperty, getSingleProperty, deleteProperty, editProperty, findProperty, postPropertyImages, postPropertyDetails, getSearchableFileds, getPropertyByDeveloper, searchFieldData,  } = require('../controllers/propertyController')

// GET
router.route('/property').get(getProperty);
router.route('/getsingleproperty').get(getSingleProperty)
router.route('/findproperty').get(findProperty)
router.route('/getsearchablefileds').get(getSearchableFileds)
router.route('/getpropertybydeveloper').get(getPropertyByDeveloper)
router.route('/serachfielddata').get(searchFieldData)


//POST 
router.route('/addproperty').post(postProperty)
router.route('/postpropertyimages').post(upload.array('photos', 10),postPropertyImages)
router.route('/postpropertydetails').post(uploadS3.array('photos', 10),postPropertyDetails)


// DELETE
router.route('/deleteproperty').delete(deleteProperty)

//UPDATE
router.route('/editproperty').patch(editProperty)




module.exports = router


