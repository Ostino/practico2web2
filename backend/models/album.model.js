const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Artista = require('./artista.model');

const Album = sequelize.define('Album', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imagen: {
    type: DataTypes.STRING,
    allowNull: false
  },
  artistaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Artista,
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'albums',
  timestamps: false

});

Artista.hasMany(Album, { foreignKey: 'artistaId', onDelete: 'CASCADE' });
Album.belongsTo(Artista, { foreignKey: 'artistaId' });

module.exports = Album;
