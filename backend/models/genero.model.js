const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Asegúrate de tener tu conexión

const GeneroMusical = sequelize.define('GeneroMusical', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  nombreDeImagen: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'generos_musicales',
  timestamps: false
});

module.exports = GeneroMusical;
