const express = require("express")
const router = express.Router()
const { postState, getAllState } = require("../controllers/state")

// GET
router.route('/getallstate').get(getAllState)



// POST
router.route('/addstate').post(postState)



module.exports = router
