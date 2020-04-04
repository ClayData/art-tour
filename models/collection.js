module.exports = function(sequelize, DataTypes) {
    var Collections = sequelize.define("Collections", {
        picture: DataTypes.STRING,
        title: DataTypes.STRING,
        artist: DataTypes.STRING,
        date: DataTypes.STRING,
        gallery: DataTypes.STRING
    })

    Collections.associate = function(models) {
        Collections.belongsTo(models.Gallery, {
            foreignKey:'gallery'
        })
    }
    Collections.associate = function(models) {
        Collections.belongsTo(models.User, {
            foreignKey:'user'
        })
    }
    return Collections;
}