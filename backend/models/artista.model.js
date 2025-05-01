const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const GeneroMusical = require('./genero.model');

const Artista = sequelize.define('Artista', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nombreDeFoto: {
      type: DataTypes.STRING,
      allowNull: false
    },
    generoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: GeneroMusical,
        key: 'id'
      }
    }
  }, {
    tableName: 'artistas',
    timestamps: false
  });
  
  // Asociación (opcional pero recomendable para consultas JOIN)
  Artista.belongsTo(GeneroMusical, { foreignKey: 'generoId', as: 'genero' });
  
  module.exports = Artista;