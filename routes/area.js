const express = require("express")
const { postArea, getAllArea, getAreaListByStateId } = require("../controllers/area")
const router = express.Router()

// GET
router.route('/getallarea').get(getAllArea)
router.route('/areabystateid').get(getAreaListByStateId)



// POST
router.route('/addarea').post(postArea)



module.exports = router
