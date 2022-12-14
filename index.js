const express = require('express')
const app = express()
const dotenv = require("dotenv")
const db = require("./models")

dotenv.config()
app.use(express.json())

//Import all routes
const property = require('./routes/property')
app.use("/api/ivantage", property)



db.sequelize.sync().then(() => {
app.listen(process.env.PORT, () => {
    console.log(`API server running on ${process.env.PORT}`)
})
})