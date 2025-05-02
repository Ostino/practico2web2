const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Album = require('./album.model');

const Cancion = sequelize.define('Cancion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  archivo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  albumId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Album,
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
});

Album.hasMany(Cancion, { foreignKey: 'albumId', onDelete: 'CASCADE' });
Cancion.belongsTo(Album, { foreignKey: 'albumId' });

module.exports = Cancion;
