const fs = require('fs');
const path = require('path');
const Cancion = require('../models/cancion.model');
const Album = require('../models/album.model');

// Crear canción
const crearCancion = async (req, res) => {
  try {
    const { nombre, albumId } = req.body;
    if (!req.file) return res.status(400).json({ mensaje: 'Archivo MP3 requerido' });

    const extension = path.extname(req.file.originalname);
    const nuevoNombreArchivo = `${nombre}_${albumId}${extension}`;
    const nuevaRuta = path.join('cancionesBackend', nuevoNombreArchivo);

    fs.renameSync(req.file.path, nuevaRuta); // Renombra el archivo

    const nuevaCancion = await Cancion.create({
      nombre,
      archivo: nuevoNombreArchivo,
      albumId
    });

    res.status(201).json(nuevaCancion);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear canción', error });
  }
};

// Obtener todas las canciones
const obtenerCanciones = async (req, res) => {
  try {
    const canciones = await Cancion.findAll({ include: Album });
    res.json(canciones);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener canciones', error });
  }
};

// Obtener una canción por ID
const obtenerCancionPorId = async (req, res) => {
  try {
    const cancion = await Cancion.findByPk(req.params.id, { include: Album });
    if (!cancion) return res.status(404).json({ mensaje: 'Canción no encontrada' });
    res.json(cancion);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener canción', error });
  }
};

// Actualizar canción
const actualizarCancion = async (req, res) => {
  try {
    const { id } = req.params;
    const cancion = await Cancion.findByPk(id);

    if (!cancion) {
      return res.status(404).json({ mensaje: 'Canción no encontrada' });
    }

    const nuevoNombre = req.body.nombre || cancion.nombre;
    const archivoNuevo = req.file;
    let nombreArchivoFinal = cancion.archivo; // por defecto, no cambia

    // Si se cambia el archivo .mp3
    if (archivoNuevo) {
      // Borrar el archivo viejo
      const rutaVieja = path.join(__dirname, '..', 'cancionesBackend', cancion.archivo);
      if (fs.existsSync(rutaVieja)) {
        fs.unlinkSync(rutaVieja);
      }

      // Renombrar archivo a "nombre_IdAlbum.mp3"
      const extension = path.extname(archivoNuevo.originalname); // .mp3
      nombreArchivoFinal = `${nuevoNombre}_${cancion.albumId}${extension}`;
      const rutaNueva = path.join(__dirname, '..', 'cancionesBackend', nombreArchivoFinal);
      fs.renameSync(archivoNuevo.path, rutaNueva);
    }
    // Si no se cambió el archivo, pero se cambió el nombre
    else if (nuevoNombre !== cancion.nombre) {
      const viejaRuta = path.join(__dirname, '..', 'cancionesBackend', cancion.archivo);
      const extension = path.extname(cancion.archivo);
      nombreArchivoFinal = `${nuevoNombre}_${cancion.albumId}${extension}`;
      const nuevaRuta = path.join(__dirname, '..', 'cancionesBackend', nombreArchivoFinal);

      if (fs.existsSync(viejaRuta)) {
        fs.renameSync(viejaRuta, nuevaRuta);
      }
    }

    // Actualizar los datos en la base
    await cancion.update({
      nombre: nuevoNombre,
      archivo: nombreArchivoFinal
    });

    res.status(200).json(cancion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar la canción' });
  }
};

const obtenerCancionesPorAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;

    const canciones = await Cancion.findAll({
      where: { albumId }
    });

    res.json(canciones);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener canciones del álbum', error });
  }
};


// Eliminar canción
const eliminarCancion = async (req, res) => {
  try {
    const cancion = await Cancion.findByPk(req.params.id);
    if (!cancion) return res.status(404).json({ mensaje: 'Canción no encontrada' });

    const ruta = path.join('cancionesBackend', cancion.archivo);
    if (fs.existsSync(ruta)) fs.unlinkSync(ruta);

    await cancion.destroy();
    res.json({ mensaje: 'Canción eliminada' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar canción', error });
  }
};

module.exports = {
  crearCancion,
  obtenerCanciones,
  obtenerCancionPorId,
  actualizarCancion,
  eliminarCancion,
  obtenerCancionesPorAlbum
};
