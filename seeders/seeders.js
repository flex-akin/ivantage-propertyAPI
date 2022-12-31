const db = require('../models/index')
const Property = db.Property
const propertyData = require('./property')

const runSeeders = async () => {
const propertyList = propertyData.propertyData
    for (let i = 0; i < propertyList.length; i++) {
        await Property.create({
            propertyCode: propertyList[i].propertyCode,
            developer: propertyList[i].developer,
            projectName: propertyList[i].projectName,
            completionDate: propertyList[i].completionDate,
            mapLocation: propertyList[i].mapLocation,
            state: propertyList[i].state,
            area: propertyList[i].area,
            propertyType: propertyList[i].propertyType,
            numberOfBedrooms: propertyList[i].numberOfBedrooms,
            numberOfWashrooms: propertyList[i].numberOfBedrooms,
            description: propertyList[i].description,
            availableUnits: propertyList[i].availableUnits,
            totalUnits: propertyList[i].totalUnits,
            price: propertyList[i].price,
            propertySize: propertyList[i].propertySize,
            propertyFeatures: propertyList[i].propertyFeatures,
            status: propertyList[i].status,
            businessType: propertyList[i].businessType,
            businessName: propertyList[i].businessName,
            image1: propertyList[i].image1, 
            image2: propertyList[i].image2,  
            image3: propertyList[i].image3,  
            image4: propertyList[i].image4,  
            image5: propertyList[i].image5,  
            image6: propertyList[i].image6,  
            image7: propertyList[i].image7,  
            image8: propertyList[i].image8,  
            image9: propertyList[i].image9,  
            image10: propertyList[i].image10,  
            flyer: propertyList[i].flyer,
            video: propertyList[i].video,
        })
        
      }
}

runSeeders()