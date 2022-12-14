const Property = require("../models/Property");

exports.getProperty = async (req, res, next) => {
try{
    const token = req.header('token');
    if(!token) return res.status(400).send("Token not found")
    const property = await Property.findAll()
    res.status(200).json({
        success: true,
        property
        
    });
}catch(err){
    return res.status(500).json({
        message: "something went wrong"
    })
}
}