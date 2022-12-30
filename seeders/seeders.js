const db = require('../models/index')
const Property = db.Property
const propertyData = require('./properties')

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

const runSeeders = async () => {
const propertyList = propertyData.propertyData
    for (let i = 0; i < propertyList.length; i++) {
    imageList = [ propertyList[i].image1, propertyList[i].image2, propertyList[i].image3, propertyList[i].image4, propertyList[i].image5, propertyList[i].image6, propertyList[i].image7, propertyList[i].image8, propertyList[i].image9,  propertyList[i].image10, ]
    imgaeList = removeItemAll(imageList, undefined)
console.log(imageList)
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
            image1: imageList[0], 
            image2: imageList[1],  
            image3: imageList[2],  
            image4: imageList[3],  
            image5: imageList[4],  
            image6: imageList[5],  
            image7: imageList[6],  
            image8: imageList[8],  
            image9: imageList[9],  
            image10: imageList[10],  
        })
        
      }
}

runSeeders()