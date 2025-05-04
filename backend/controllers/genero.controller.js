const fs = require('fs');
const path = require('path');
const GeneroMusical = require('../models/genero.model');
const Artista = require('../models/artista.model')

const crearGenero = async (req, res) => {
  try {
    const { nombre } = req.body;
    const archivo = req.file;

    if (!archivo) {
      return res.status(400).json({ mensaje: 'No se recibió ninguna imagen' });
    }

    const extension = path.extname(archivo.originalname);
    const nuevoNombreArchivo = `${nombre}${extension}`;
    const nuevaRuta = path.join(__dirname, '..', 'imagenesBackend', nuevoNombreArchivo);

    fs.renameSync(archivo.path, nuevaRuta);

    const nuevoGenero = await GeneroMusical.create({
      nombre,
      nombreDeImagen: nuevoNombreArchivo
    });

    res.status(201).json(nuevoGenero);
  } catch (error) {
    console.error('Error al crear género musical:', error);
    res.status(500).json({ mensaje: 'Error al crear género musical' });
  }
};

const obtenerGeneros = async (req, res) => {
  const generos = await GeneroMusical.findAll();
  res.json(generos);
};

const obtenerGeneroPorId = async (req, res) => {
  const genero = await GeneroMusical.findByPk(req.params.id);
  if (genero) {
    res.json(genero);
  } else {
    res.status(404).json({ mensaje: 'Género no encontrado' });
  }
};

const actualizarGenero = async (req, res) => {
  try {
    const genero = await GeneroMusical.findByPk(req.params.id);
    if (!genero) {
      return res.status(404).json({ mensaje: 'Género no encontrado' });
    }

    const nuevoNombre = req.body.nombre || genero.nombre;
    let nuevoNombreImagen = genero.nombreDeImagen; 

    if (req.file) {
      const extension = path.extname(req.file.originalname);
      const nuevoNombreArchivo = `${nuevoNombre}${extension}`;
      const nuevaRuta = path.join('imagenesBackend', nuevoNombreArchivo);

      fs.renameSync(req.file.path, nuevaRuta);

      if (genero.nombreDeImagen && genero.nombreDeImagen !== nuevoNombreArchivo) {
        const rutaAntigua = path.join('imagenesBackend', genero.nombreDeImagen);
        if (fs.existsSync(rutaAntigua)) {
          fs.unlinkSync(rutaAntigua);
        }
      }

      nuevoNombreImagen = nuevoNombreArchivo;
    }

    await genero.update({
      nombre: nuevoNombre,
      nombreDeImagen: nuevoNombreImagen
    });

    res.json(genero);
  } catch (error) {
    console.error('Error al actualizar género:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

const eliminarGenero = async (req, res) => {
  try {
    const idGenero = parseInt(req.params.id);

    if (idGenero === 7) {
      return res.status(400).json({ mensaje: 'No se puede eliminar el género pivote (ID 7)' });
    }

    const genero = await GeneroMusical.findByPk(idGenero);
    if (!genero) {
      return res.status(404).json({ mensaje: 'Género no encontrado' });
    }

    const artistas = await Artista.findAll({ where: { generoId: idGenero } });

    for (const artista of artistas) {
      artista.generoId = 7;
      await artista.save();
    }

    const rutaImagen = path.join('imagenesBackend', genero.nombreDeImagen);
    if (fs.existsSync(rutaImagen)) {
      fs.unlinkSync(rutaImagen);
    }

    await genero.destroy();

    res.json({ mensaje: 'Género eliminado, artistas actualizados y su imagen ha sido borrada' });
  } catch (error) {
    console.error('Error al eliminar género:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

module.exports = {
  crearGenero,
  obtenerGeneros,
  obtenerGeneroPorId,
  actualizarGenero,
  eliminarGenero
};
