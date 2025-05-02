const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./config/database');
const generoRoutes = require('./routes/genero.routes');
const artistaRoutes = require('./routes/artista.routes');
const albumRoutes = require('./routes/album.routes');

const path = require('path');

app.use(cors()); // Permite que el frontend pueda hacer peticiones
const Album = require('./models/album.model'); // Ajusta la ruta si es distinta

const PORT = 3000;
async function iniciarServidor() {
    try {
      await sequelize.authenticate();
      console.log('✅ Conexión exitosa a la base de datos');
      await sequelize.sync();
      const PORT = 3000;
      app.listen(PORT, () => {
        console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error('❌ Error al conectar con la base de datos:', error);
    }
  }
  iniciarServidor();

  async function mostrarTablas() {
    const [resultados] = await sequelize.query(
      "SELECT name FROM sqlite_master WHERE type='table';"
    );
    console.log("Tablas en la base de datos:");
    resultados.forEach(t => console.log(t.name));
  }
  mostrarTablas();

  app.use('/api/generos', generoRoutes);
  app.use('/imagenes', express.static(path.join(__dirname, 'ImagenesBackend')));
  app.use('/api/artistas', artistaRoutes);
  app.use('/api/albumes', albumRoutes);

