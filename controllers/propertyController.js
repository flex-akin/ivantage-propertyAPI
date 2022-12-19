const db = require('../models/index')
const Property = db.Property


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
            message: `the property with property code ${property.propertyCode} have been updated`,
            property
    
            
        });
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message: "something went wrong, Try again"
        })
    }
    }


   