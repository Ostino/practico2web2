// models/cancion.model.js
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
    allowNull: false // el nombre del archivo .mp3
  },
  albumId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Album,
      key: 'id'
    },
    onDelete: 'CASCADE' // Esto hace que si se elimina el álbum, se eliminen sus canciones
  }
}, {
  tableName: 'canciones',
  timestamps: false
});

// Relación explícita (opcional si ya la tienes en otro lado)
Album.hasMany(Cancion, {foreignKey: 'albumId', onDelete: 'CASCADE'
});
Cancion.belongsTo(Album, {foreignKey: 'albumId'});
module.exports = Cancion;
