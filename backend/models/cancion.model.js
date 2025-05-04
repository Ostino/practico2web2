const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Album = require('./album.model');

const Cancion = sequelize.define('Cancion', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
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
}, {
  tableName: 'canciones',
  timestamps: false
});

Album.hasMany(Cancion, {foreignKey: 'albumId', onDelete: 'CASCADE'
});
Cancion.belongsTo(Album, {foreignKey: 'albumId'});
module.exports = Cancion;
