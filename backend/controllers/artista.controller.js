const Artista = require('../models/artista.model');
const fs = require('fs');
const path = require('path');
const GeneroMusical = require('../models/genero.model');


const crearArtista = async (req, res) => {
  try {
    const { nombre, generoId } = req.body;
    const imagen = req.file;

    if (!imagen || !nombre || !generoId) {
      return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
    }

    const extension = path.extname(imagen.originalname);
    const nuevoNombre = `${nombre}_art${extension}`;
    const rutaDestino = path.join(__dirname, '../imagenesBackend', nuevoNombre);

    // Mover imagen y renombrar
    fs.renameSync(imagen.path, rutaDestino);

    // Guardar en BD
    const nuevoArtista = await Artista.create({
      nombre,
      nombreDeFoto: nuevoNombre,
      generoId
    });

    res.status(201).json(nuevoArtista);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear el artista', error });
  }
};

const actualizarArtista = async (req, res) => {
  try {
    const artista = await Artista.findByPk(req.params.id);

    if (!artista) {
      return res.status(404).json({ mensaje: 'Artista no encontrado' });
    }

    const { nombre, generoId } = req.body;
    const imagen = req.file;
    const cambios = {};

    if (nombre) cambios.nombre = nombre;
    if (generoId) cambios.generoId = generoId;

    if (imagen) {
      // Eliminar imagen anterior
      const rutaAnterior = path.join(__dirname, '../imagenesBackend', artista.nombreDeFoto);
      if (fs.existsSync(rutaAnterior)) {
        fs.unlinkSync(rutaAnterior);
      }

      const extension = path.extname(imagen.originalname);
      const nuevoNombre = `${nombre || artista.nombre}_art${extension}`;
      const rutaNueva = path.join(__dirname, '../imagenesBackend', nuevoNombre);
      fs.renameSync(imagen.path, rutaNueva);
      cambios.nombreDeFoto = nuevoNombre;
    }

    await artista.update(cambios);
    res.json(artista);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el artista', error });
  }
};

const eliminarArtista = async (req, res) => {
  try {
    const artista = await Artista.findByPk(req.params.id);

    if (!artista) {
      return res.status(404).json({ mensaje: 'Artista no encontrado' });
    }

    const rutaImagen = path.join(__dirname, '../imagenesBackend', artista.nombreDeFoto);
    if (fs.existsSync(rutaImagen)) {
      fs.unlinkSync(rutaImagen);
    }

    await artista.destroy();
    res.json({ mensaje: 'Artista eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el artista', error });
  }
};

const obtenerArtistas = async (req, res) => {
  try {
    const artistas = await Artista.findAll({ include: 'genero' });
    res.json(artistas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener artistas', error });
  }
};

const obtenerArtistaPorId = async (req, res) => {
  try {
    const artista = await Artista.findByPk(req.params.id, { include: 'genero' });

    if (!artista) {
      return res.status(404).json({ mensaje: 'Artista no encontrado' });
    }

    res.json(artista);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener artista', error });
  }
};

const obtenerArtistasPorGenero = async (req, res) => {
    const { id } = req.params;
  
    try {
      const artistas = await Artista.findAll({
        where: { generoId: id },
        include: {
          model: GeneroMusical,
          attributes: ['nombre'],
          as: 'genero' 
        }
      });
  
      res.json(artistas);
    } catch (error) {
      console.error('Error al obtener artistas por género:', error);
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  };

module.exports = {
  crearArtista,
  actualizarArtista,
  eliminarArtista,
  obtenerArtistas,
  obtenerArtistaPorId,
  obtenerArtistasPorGenero
};
