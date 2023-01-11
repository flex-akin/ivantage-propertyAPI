const { closeSync } = require('fs');
const { where, Op, json } = require('sequelize');
const { uploadFile } = require('../helpers/s3');
const { sequelize } = require('../models/index');
const db = require('../models/index')
const Property = db.Property






exports.getProperty = async (req, res, next) => {
try{
    function removeItemAll(arr, value) {
        var i = 0;
        while (i < arr.length) {
          if (arr[i] === value) {
            arr.splice(i, 1);
          } else {
            ++i;
          }
        }
        return arr;
      }

    const pageAsNumber = Number.parseInt(req.query.page)
    const sizeAsNumber = Number.parseInt(req.query.size)

    let page = 0
    if(!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
        page = pageAsNumber - 1
    }

    let size = 100000000
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

    var len = 0
    if (size < property.count) {
        len = size }
        else{
       len = property.count
        }
    
        
    const propertyData = []
    for ( let i = 0; i < len ; i++ ) {
        var images = removeItemAll(property.rows[i].images, "")
        images = removeItemAll(images, null)
        collectData = {
            id: property.rows[i].id,
            propertyCode: property.rows[i].propertyCode,
            developer: property.rows[i].developer,
            projectName: property.rows[i].projectName,
            completionDate: property.rows[i].completionDate,
            mapLocation: property.rows[i].mapLocation,
            state: property.rows[i].state,
            area: property.rows[i].area,
            propertyType: property.rows[i].propertyType,
            numberOfBedrooms: property.rows[i].numberOfBedrooms,
            numberOfWashrooms: property.rows[i].numberOfBedrooms,
            description: property.rows[i].description,
            availableUnits: property.rows[i].availableUnits,
            totalUnits: property.rows[i].totalUnits,
            price: property.rows[i].price,
            propertySize: property.rows[i].propertySize,
            propertyFeatures: property.rows[i].propertyFeatures,
            status: property.rows[i].status,
            businessType: property.rows[i].businessType,
            businessName: property.rows[i].businessName,
            flyer: property.rows[i].flyer,
            video: property.rows[i].video,
            images: images
        }
        propertyData.push(collectData)

        

    }

    console.log(property.rows)
    res.status(200).json({
        success: true,
        data: {
            count: property.count,
            pageDataCount : propertyData.length,
            totalPages: totalPages,
            nextPage : nextPage ,
            previousPage : previousPage,
            page :  page + 1,
            property : propertyData

            
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
            message : ` property code ${propertyPostCode} have been assigned to property ${check.projectName}`
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
            function removeItemAll(arr, value) {
                var i = 0;
                while (i < arr.length) {
                  if (arr[i] === value) {
                    arr.splice(i, 1);
                  } else {
                    ++i;
                  }
                }
                return arr;
              }
           
            const token = req.header('token');
            if(!token) return res.status(400).send("Token not found")

            const propertyId = req.query.propertyCode
            const SingleProperty = await Property.findOne({ where: { propertyCode : propertyId } })
            var images = removeItemAll(SingleProperty.images, "")
            images = removeItemAll(images, null)
            res.status(200).json({
                success: true,
                message : "Property fetched successfully",
                property : {
                    id: SingleProperty.id,
                    propertyCode: SingleProperty.propertyCode,
                    developer: SingleProperty.developer,
                    projectName: SingleProperty.projectName,
                    completionDate: SingleProperty.completionDate,
                    mapLocation: SingleProperty.mapLocation,
                    state: SingleProperty.state,
                    area: SingleProperty.area,
                    propertyType: SingleProperty.propertyType,
                    numberOfBedrooms: SingleProperty.numberOfBedrooms,
                    numberOfWashrooms: SingleProperty.numberOfBedrooms,
                    description: SingleProperty.description,
                    availableUnits: SingleProperty.availableUnits,
                    totalUnits: SingleProperty.totalUnits,
                    price: SingleProperty.price,
                    propertySize: SingleProperty.propertySize,
                    propertyFeatures: SingleProperty.propertyFeatures,
                    status: SingleProperty.status,
                    businessType: SingleProperty.businessType,
                    businessName: SingleProperty.businessName,
                    flyer: SingleProperty.flyer,
                    video: SingleProperty.video,
                    images: images
                }
        
                
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
            const property = await Property.findAll({
                where :{
                    propertyCode : propertyId
                }
            })
            if (property.length == 0) return res.status(400).json({
                success : false,
                message : "This property doesn't exist"
            })
        
            await Property.destroy({ where: { propertyCode : propertyId } })
           
            res.status(200).json({
                success: true,
                message : `Property with code ${propertyId} deleted successfully`,


            });
        }catch(err){
            console.log(err)
            return res.status(500).json({
                success: false,
                message: err.message,
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

        function removeItemAll(arr, value) {
        var i = 0;
        while (i < arr.length) {
        if (arr[i] === value) {
            arr.splice(i, 1);
        } else {
            ++i;
        }
        }
        return arr;
    }


        const pageAsNumber = Number.parseInt(req.query.page)
        const sizeAsNumber = Number.parseInt(req.query.size)
        const property_type = req.query.propertyType
        var bedrooms = Number.parseInt(req.query.numberOfBedroooms)
        const area = req.query.area
        const status = req.query.status
        const state = req.query.state
        const propertyData = await Property.findAll()
        var maxPrice = Number.parseInt(req.query.maxPrice)
        var minPrice = Number.parseInt(req.query.minPrice)

    

      if (isNaN(bedrooms)) {
        bedrooms = "bedrooms"
    }
    if (isNaN(minPrice)) {
        minPrice = "minPrice"
    }
    if (isNaN(maxPrice)) {
        maxPrice = "maxPrice"
    }





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
    
        let size = 100000000
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
                numberOfBedrooms: bedrooms == "bedrooms" ? [0,1,2,3,4,5,6,7,8,9] : [bedrooms],
                state: state == "" ? allState.filter(onlyUnique) : [state],
                area : area == "" ? allArea.filter(onlyUnique) : [area], 
                status: status == "" ? allStatus.filter(onlyUnique) : [status],
                price : {[Op.and] : [
                    {[Op.lte]: maxPrice == "maxPrice" ? 100000000000 : maxPrice} ,
                     {[Op.gte]: minPrice == "minprice" ? 0 : minPrice}

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

        var len = 0
        if (size < property.count) {
            len = size }
            else{
           len = property.count
            }

        const propertyDetails = []
    for ( let i = 0; i < len  ; i++ ) {
        var images = removeItemAll(property.rows[i].images, "")
        images = removeItemAll(images, null)
        collectData = {
            id: property.rows[i].id,
            propertyCode: property.rows[i].propertyCode,
            developer: property.rows[i].developer,
            projectName: property.rows[i].projectName,
            completionDate: property.rows[i].completionDate,
            mapLocation: property.rows[i].mapLocation,
            state: property.rows[i].state,
            area: property.rows[i].area,
            propertyType: property.rows[i].propertyType,
            numberOfBedrooms: property.rows[i].numberOfBedrooms,
            numberOfWashrooms: property.rows[i].numberOfBedrooms,
            description: property.rows[i].description,
            availableUnits: property.rows[i].availableUnits,
            totalUnits: property.rows[i].totalUnits,
            price: property.rows[i].price,
            propertySize: property.rows[i].propertySize,
            propertyFeatures: property.rows[i].propertyFeatures,
            status: property.rows[i].status,
            businessType: property.rows[i].businessType,
            businessName: property.rows[i].businessName,
            flyer: property.rows[i].flyer,
            video: property.rows[i].video,
            images: images,
        }
        propertyDetails.push(collectData)
    }
        
        res.status(200).json({
            success: true,
            message: "property category fetched successfully",      
            data: {
                count: property.count,
                totalPages: totalPages,
                nextPage : nextPage ,
                previousPage : previousPage,
                page :  page,
                property : propertyDetails 
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
                console.log("req.body",req.body)
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

            exports.getSearchableFileds = async (req, res, next) => {
                try{
                    const token = req.header('token');
                    if(!token) return res.status(400).send("Token not found")
                  
            
                   const searchableFileds = [
                    {
                        label: "Maximum Price",
                        value: "maxPrice",
                        description: "The maximum price range"
                    },
                    {
                        label: "Minimum Price",
                        value: "minPrice",
                        description: "The minimum price range"
                    },
                    {
                        label: "Number of Bedrooms",
                        value: "numberOfBedrooms",
                        description: "number of bedrroms "
                    },
                    {
                        label: "Property Type",
                        value: "propertyType",
                        description: "type could be either apratment, terrace, maisonette, etc."
                    },
                    {
                        label: "state",
                        value: "state",
                        description: "the state where the property is located"
                    },
                    {
                        label: "area",
                        value: "area",
                        description: "the area where the property is located "
                    },
                    {
                        label: "status",
                        value: "status",
                        description: "status could be off plan or completed etc."
                    },
                   ]
            
                    res.status(200).json({
                        success: true,
                        message: `All searchable fileds successfully returned`,
                        data: searchableFileds
                
                        
                    });
                }catch(err){
                    console.log(err)
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    })
                }
                }



                exports.getPropertyByDeveloper = async (req, res, next) => {
                    try{
                        function removeItemAll(arr, value) {
                            var i = 0;
                            while (i < arr.length) {
                              if (arr[i] === value) {
                                arr.splice(i, 1);
                              } else {
                                ++i;
                              }
                            }
                            return arr;
                          }
                    
                        const pageAsNumber = Number.parseInt(req.query.page)
                        const sizeAsNumber = Number.parseInt(req.query.size)
                        const developerName = req.query.developer
                    
                        let page = 0
                        if(!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
                            page = pageAsNumber - 1
                        }
                    
                        let size = 100000000
                        if(!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0){
                            size = sizeAsNumber
                        }
                    
                        const token = req.header('token');
                        if(!token) return res.status(400).send("Token not found")
                        const property = await Property.findAndCountAll({
                            limit: size,
                            offset: size * page,
                            where : {
                                developer : developerName
                            }
                        });
                        const totalPages = (Math.ceil(property.count / size)) 
                        const nextPage = page != (totalPages - 1) ? page + 2 : null
                        const previousPage = page != 0 ? page  : null
                    
                        var len = 0
                        if (size < property.count) {
                            len = size }
                            else{
                           len = property.count
                            }
                        
                            
                        const propertyData = []
                        for ( let i = 0; i < len ; i++ ) {
                            var images = removeItemAll(property.rows[i].images, "")
                            images = removeItemAll(images, null)
                            collectData = {
                                id: property.rows[i].id,
                                propertyCode: property.rows[i].propertyCode,
                                developer: property.rows[i].developer,
                                projectName: property.rows[i].projectName,
                                completionDate: property.rows[i].completionDate,
                                mapLocation: property.rows[i].mapLocation,
                                state: property.rows[i].state,
                                area: property.rows[i].area,
                                propertyType: property.rows[i].propertyType,
                                numberOfBedrooms: property.rows[i].numberOfBedrooms,
                                numberOfWashrooms: property.rows[i].numberOfBedrooms,
                                description: property.rows[i].description,
                                availableUnits: property.rows[i].availableUnits,
                                totalUnits: property.rows[i].totalUnits,
                                price: property.rows[i].price,
                                propertySize: property.rows[i].propertySize,
                                propertyFeatures: property.rows[i].propertyFeatures,
                                status: property.rows[i].status,
                                businessType: property.rows[i].businessType,
                                businessName: property.rows[i].businessName,
                                flyer: property.rows[i].flyer,
                                video: property.rows[i].video,
                                images: images
                            }
                            propertyData.push(collectData)
                    
                            
                    
                        }
                    
                        console.log(property.rows)
                        res.status(200).json({
                            success: true,
                            data: {
                                count: property.count,
                                pageDataCount : propertyData.length,
                                totalPages: totalPages,
                                nextPage : nextPage ,
                                previousPage : previousPage,
                                page :  page + 1,
                                property : propertyData
                    
                                
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
            
        exports.searchFieldData = async  (req, res, next) => {
            try{
                const token = req.header('token');
            if(!token) return res.status(400).send("Token not found")

            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
              }

        const data = await Property.findAll({ attributes : ['area', 'state', 'propertyType', 'status'] ,
        });
            stateList = []
            propertyTypeList = []
            statusList = []
            for(var i = 0; i < data.length; i++) {
                var state = data[i].state;
                var propertyType = data[i].propertyType;
                var status = data[i].status;
                stateList.push(state)
                propertyTypeList.push(propertyType)
                statusList.push(status)
                
            }

            var states = stateList.filter(onlyUnique)
            var properties = propertyTypeList.filter(onlyUnique)
            var statuses = statusList.filter(onlyUnique)

            var areas = []
            for (let i = 0; i < states.length; i++){
                const name = states[i]
                myArray = []

                
                for (let j = 0; j < data.length; j++) {
                    
                    if (states[i] == data[j].state){
                        myArray.push(data[j].area)

                    }
                    myArray = myArray.filter(onlyUnique)

                }

                var key = name
                myObj = {
                    [key] : myArray
                }      
                areas.push(myObj)

            }



            res.status(200).json({
                success: true,
                propertyType : properties,
                states,
                status: statuses,
                areas


            });

            }
            catch (err) {
                console.log(err)
                return res.status(500).json({
                    success: false,
                    message: err.message,
                })

            }
        }