const express = require("express")
const router = express.Router()
const { getProperty } = require('../controllers/propertyController')

router.route('/property').get(getProperty);

module.exports = router