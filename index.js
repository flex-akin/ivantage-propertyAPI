const express = require('express')
const app = express()
const dotenv = require("dotenv")
const db = require("./models")
const cors = require('cors')

dotenv.config()

app.use(express.json({ limit: '50mb', extended: true }))
app.use(cors())

//Import all routes
    // Import property routes
const property = require('./routes/property')
app.use("/api/ivantage", property)

    // Import project routes
const project = require('./routes/project')
app.use("/api/ivantage/project", project)

    // Import project routes
const state = require('./routes/state')
app.use("/api/ivantage/state", state)


    // Import project routes
const area = require('./routes/area')
app.use("/api/ivantage/area", area)




db.sequelize.sync().then(() => {
app.listen(process.env.PORT, () => {
    console.log(`API server running on ${process.env.PORT}`)
})
})