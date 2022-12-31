module.exports = (sequelize, DataTypes) => {
    const Area = sequelize.define("Area", {
        areaId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        area: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true,
            }
        },
        stateId : {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate:{
                notEmpty: true,
            }

        }
       
    },
    {
        freezeTableName: true
      })
return Area
}