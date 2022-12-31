module.exports = (sequelize, DataTypes) => {
    const State = sequelize.define("State", {
        stateId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true,
            }
        },
       
    },
    {
        freezeTableName: true
      })
return State
}