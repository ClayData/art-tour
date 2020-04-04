module.exports = function(sequelize, DataTypes) {
    var Gallery = sequelize.define("Gallery", {
        name: {type: DataTypes.STRING,
               primaryKey: true,
               unique: true}
    });

    Gallery.associate = function(models) {
        Gallery.hasMany(models.Collections, {
            onDelete: "cascade"
        });
    };
    Gallery.associate = function(models) {
        Gallery.belongsTo(models.User, {
            foreignKey:'user'
        })
    }

    return Gallery;
}