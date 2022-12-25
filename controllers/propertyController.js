const { closeSync } = require('fs');
const { where, Op } = require('sequelize');
const { uploadFile } = require('../helpers/s3');
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

    let size = 100
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
        data: {
            count: property.count,
            totalPages: totalPages,
            nextPage : nextPage ,
            previousPage : previousPage,
            page :  page + 1,
            property : property.rows  
        },
        message : "All properties fetched successfully"

        
    });
}catch(err){
    console.log(err)
    return res.status(500).json({
        success: false,
        message: err.message
    })
}
}


exports.postProperty = async (req, res, next) => {
    try{
        const token = req.header('token');
        if(!token) return res.status(400).send("Token not found")
        const propertyPostCode = req.body.propertyCode
        var check = await Property.findOne({
            where : {
                propertyCode : propertyPostCode
            }
        })


        if (check) return res.status(400).json({
            success: false,
            message : ` property code ${propertyPostCode} have been assignrd to property ${check.projectName}`
        })

        const property = await Property.create(req.body)
        res.status(200).json({
            success: true,
            message: `the property with property code ${property.propertyCode} have been uploaded`,
            property
    
            
        });
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: err.message
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
                message : "Property fetched successfully",
                SingleProperty
        
                
            });
        }catch(err){
            console.log(err)
            return res.status(500).json({
                message: err.message
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
                message : `Property with code ${propertyId} deleted successfully`

            });
        }catch(err){
            console.log(err)
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
        }   


exports.editProperty = async (req, res, next) => {
    try{
        const token = req.header('token');
        if(!token) return res.status(400).send("Token not found")
        const propertyID = req.query.propertyCode
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
            success: false,
            message: err.message
        })
    }
    }


   
exports.findProperty = async (req, res, next) => {
    try{
        const pageAsNumber = Number.parseInt(req.query.page)
        const sizeAsNumber = Number.parseInt(req.query.size)
        const property_type = req.query.propertyType
        const bedrooms = Number.parseInt(req.query.numberOfBedroooms)
        const area = req.query.area
        const status = req.query.status
        const state = req.query.state
        const propertyData = await Property.findAll()
        const maxPrice = Number.parseInt(req.query.maxPrice)
        const minPrice = Number.parseInt(req.query.minPrice)

        var allStatus = []
        var allPropertyType = []
        var allArea = []
        var allState = []
    
        for (let i = 0; i < propertyData.length; i++) {
            allStatus.push(propertyData[i].status)
            allPropertyType.push(propertyData[i].propertyType)
            allArea.push(propertyData[i].area)
            allState.push(propertyData[i].state)
          }
        
          function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
          }
        
        console.log(allStatus.filter(onlyUnique),allPropertyType.filter(onlyUnique), allArea.filter(onlyUnique), allState.filter(onlyUnique) )

    
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
            offset: size * page,
            where: {
                propertyType: property_type == "" ? allPropertyType.filter(onlyUnique) : property_type,
                numberOfBedroooms: bedrooms == "" ? [0,1,2,3,4,5,6,7,8,9] : [bedrooms],
                state: state == "" ? allState.filter(onlyUnique) : [state],
                area : area == "" ? allArea.filter(onlyUnique) : [area], 
                status: status == "" ? allStatus.filter(onlyUnique) : [status],
                price : {[Op.and] : [
                    {[Op.lte]: maxPrice == NaN ? 1000000000 : maxPrice} ,
                     {[Op.gte]: minPrice == NaN ? 0 : minPrice}

                ]
            }
        }
    });
        const totalPages = (Math.ceil(property.count / size)) 
        var nextPage = page != (totalPages - 1) ? page + 2 : null
        var previousPage = page != 0 ? page  : null
        page = page + 1
    
        if (totalPages == 0) return res.status(404).json({
            success : false,
            message : "No Property Found"
        })
        
        res.status(200).json({
            success: true,
            message: "property category fetched successfully",      
            data: {
                count: property.count,
                totalPages: totalPages,
                nextPage : nextPage ,
                previousPage : previousPage,
                page :  page,
                property : property.rows  
            }
    
            
        });
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
    }

    exports.postPropertyImages = async (req, res, next) => {
        try{
            const token = req.header('token');
            if(!token) return res.status(400).send("Token not found")

            const files = req.files
            imageList = []
            for (let i = 0; i < files.length; i++) {
                const result = await uploadFile(files[i])
                imageList.push(result.Location)
              }

           console.log( imageList )
           console.log(files)
            const property = await Property.create({
                propertyCode: req.body.propertyCode,
                developer: req.body.developer,
                projectName: req.body.projectName,
                completionDate: req.body.completionDate,
                mapLocation: req.body.mapLocation,
                state: req.body.state,
                area: req.body.area,
                propertyType: req.body.propertyType,
                numberOfBedroooms: req.body.numberOfBedroooms,
                numberOfWashroooms: req.body.numberOfBedroooms,
                description: req.body.description,
                availableUnits: req.body.availableUnits,
                totalUnits: req.body.totalUnits,
                price: req.body.price,
                propertySize: req.body.propertySize,
                propertyFeatures: req.body.propertyFeatures,
                status: req.body.status,
                businessType: req.body.businessType,
                businessName: req.body.businessName,
                image1: imageList[0], 
                image2: imageList[1],  
                image3: imageList[2],  
                image4: imageList[3],  
                image5: imageList[4],  
                image6: imageList[5],  
                image7: imageList[6],  
                image8: imageList[7],  
                image9: imageList[8],  
                image10: imageList[9],  

            })
            res.status(200).json({
                success: true,
                data : {
                    property,
                },
                message: `the property with property code ${property.propertyCode} have been uploaded`,
                // property
        
                
            });
        }catch(err){
            console.log(err)
            return res.status(500).json({
                message: err.message
            })
        }
        }


        exports.postPropertyDetails = async (req, res, next) => {
            try{
                const token = req.header('token');
                if(!token) return res.status(400).send("Token not found")
    
                const files = req.files
             
    
               console.log(files)
               const property = await Property.create({
                propertyCode: req.body.propertyCode,
                developer: req.body.developer,
                projectName: req.body.projectName,
                completionDate: req.body.completionDate,
                mapLocation: req.body.mapLocation,
                state: req.body.state,
                area: req.body.area,
                propertyType: req.body.propertyType,
                numberOfBedroooms: req.body.numberOfBedroooms,
                numberOfWashroooms: req.body.numberOfBedroooms,
                description: req.body.description,
                availableUnits: req.body.availableUnits,
                totalUnits: req.body.totalUnits,
                price: req.body.price,
                propertySize: req.body.propertySize,
                propertyFeatures: req.body.propertyFeatures,
                status: req.body.status,
                businessType: req.body.businessType,
                businessName: req.body.businessName,
                image1: files[0] ? files[0].location : null , 
                image2: files[1] ? files[1].location : null ,  
                image3: files[2] ? files[2].location : null ,  
                image4: files[3] ? files[3].location : null ,  
                image5: files[4] ? files[4].location : null ,  
                image6: files[5] ? files[5].location : null ,  
                image7: files[6] ? files[6].location : null ,  
                image8: files[7] ? files[7].location : null ,  
                image9: files[8] ? files[8].location : null ,  
                image10: files[9] ? files[9].location : null ,  

            })
               
            
                res.status(200).json({
                    success: true,
                    data : {
                    message: `the property with property code ${property.propertyCode} have been uploaded`,
                    property
                        
                    },
                   
            
                    
                });
            }catch(err){
                console.log(err)
                return res.status(500).json({
                    message: err.message
                })
            }
            }