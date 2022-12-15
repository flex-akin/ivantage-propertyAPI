const express = require("express")
const router = express.Router()
const { getProperty, postProperty } = require('../controllers/propertyController')

router.route('/property').get(getProperty);
router.route('/addproperty').post(postProperty)

module.exports = router


