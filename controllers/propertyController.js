const db = require('../models/index')
const Property = db.Property


// reads in the cloudinary env variable - put this before
require("dotenv").config();
// we're aliasing version 2 and referencing with a variable
const cloudinary = require("cloudinary").v2;
// cloudinary picks up env and is now configured
console.log(cloudinary.config().cloud_name);

// Node.js SDK Uploader function returns a Promise
cloudinary.uploader
  .upload("./assets/images/breakfast.jpg", {
    // image is the default resource type if you don't specify
    resource_type: "image",
  })
  .then((result) => {
    // JSON.stringify will provide a formatted string
    // 1st param is the value to be output
    // 2nd param null is a function that can be applied to the output
    // 3rd param is the number of space characters to use for whitespace in formatting the output
    console.log("success", JSON.stringify(result, null, 2));
  })
  .catch((error) => {
    console.log("error", JSON.stringify(error, null, 2));
  });


exports.getProperty = async (req, res, next) => {
try{
    const pageAsNumber = Number.parseInt(req.query.page)
    const sizeAsNumber = Number.parseInt(req.query.size)

    let page = 0
    if(!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
        page = pageAsNumber - 1
    }

    let size = 25
    if(!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0){
        size = sizeAsNumber
    }

    const token = req.header('token');
    if(!token) return res.status(400).send("Token not found")
    const property = await Property.findAndCountAll({
        limit: size,
        offset: size * page
    });
    const totalPages = (Math.ceil(property.count / size)) 
    const nextPage = page != (totalPages - 1) ? page + 2 : null
    const previousPage = page != 0 ? page  : null

    res.status(200).json({
        success: true,
        content: {
            count: property.count,
            totalPages: totalPages,
            nextPage : nextPage ,
            previousPage : previousPage,
            page :  page + 1,
            property : property.rows  
        }

        
    });
}catch(err){
    console.log(err)
    return res.status(500).json({
        message: "something went wrong"
    })
}
}

exports.postProperty = async (req, res, next) => {
    try{
        const token = req.header('token');
        if(!token) return res.status(400).send("Token not found")
        const property = await Property.create(req.body)
        res.status(200).json({
            success: true,
            message: `the property with property code ${property.propertyCode} have been uploaded`,
            property
    
            
        });
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message: "something went wrong, Try again"
        })
    }
    }

    exports.getSingleProperty = async (req, res, next) => {
        try{
           
            const token = req.header('token');
            if(!token) return res.status(400).send("Token not found")

            const propertyId = req.query.propertyCode
            const SingleProperty = await Property.findOne({ where: { propertyCode : propertyId } })
           
            res.status(200).json({
                success: true,
                SingleProperty
        
                
            });
        }catch(err){
            console.log(err)
            return res.status(500).json({
                message: "something went wrong"
            })
        }
        }

    exports.deleteProperty = async (req, res, next) => {
        try{
           
            const token = req.header('token');
            if(!token) return res.status(400).send("Token not found")

            const propertyId = req.query.propertyCode
            await Property.destroy({ where: { propertyCode : propertyId } })
           
            res.status(200).json({
                success: true,
            });
        }catch(err){
            console.log(err)
            return res.status(500).json({
                message: "something went wrong"
            })
        }
        }   


exports.editProperty = async (req, res, next) => {
    try{
        const token = req.header('token');
        if(!token) return res.status(400).send("Token not found")
        const propertyID = req.query.propertyCode
        console.log(propertyID)
        const property = await Property.update(req.body, {
            where: {
                propertyCode: propertyID
            }
        })
        res.status(200).json({
            success: true,
            message: `the property with property code ${propertyID} have been updated`,
            property
    
            
        });
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message: "something went wrong, Try again"
        })
    }
    }


   