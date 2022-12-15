module.exports = (sequelize, DataTypes) => {
    const Property = sequelize.define("Property", {
        propertyCode: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true,
            }
        },
        developer: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true,
            }
        },
        propertyName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true,
            }
        },
        completionDate: {
            type: DataTypes.DATEONLY,
         
        },
        mapLocation: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true,
            }
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true,
            }
        },
        area: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true,
            }
        },
        propertyType: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true,
            }
        },
        numberOfBedroooms: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate:{
                notEmpty: true,
            }
        },
        numberOfWashroooms: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate:{
                notEmpty: true,
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true,
            }
        },
        availableUnits: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate:{
                notEmpty: true,
            }
        },
        totalUnits: {
            type: DataTypes.STRING,
          
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate:{
                notEmpty: true,
            }
        },
        propertySize: {
            type: DataTypes.STRING,
          
        },
        propertyFeatures: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true,
            }
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true,
            }
        },
        businessType: {
            type: DataTypes.STRING,
           
        },
        businessName: {
            type: DataTypes.STRING,
            
        },
        projectID:{
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true,
            }

        },
        image1: {
            type: DataTypes.STRING,
            
        }, 
         image2: {
            type: DataTypes.STRING,
            
        },  
        image3: {
            type: DataTypes.STRING,
            
        },  
        image4: {
            type: DataTypes.STRING,
            
        },  
        image5: {
            type: DataTypes.STRING,
            
        },  
        image6: {
            type: DataTypes.STRING,
            
        },  
        image7: {
            type: DataTypes.STRING,
            
        },  
        image8: {
            type: DataTypes.STRING,
            
        },  
        image9: {
            type: DataTypes.STRING,
            
        },  
        image10: {
            type: DataTypes.STRING,
            
        },  

        images: {
            type: DataTypes.VIRTUAL,
            get() {
                const values = [ this.image1, this.image2, this.image3, this.image4,
                this.image5, this.image6, this.image7, this.image8, this.image9, this.image10 ]
              return values
            },
            set(value) {
              throw new Error('Do not try to set the `images` value!');
            }
          },
        flyer: {
            type: DataTypes.STRING,
           
        },  
        video: {
            type: DataTypes.STRING,
          
        },
    },
    {
        freezeTableName: true
      })
return Property
}