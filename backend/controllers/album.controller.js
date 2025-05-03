const Album = require('../models/album.model');
const fs = require('fs');
const path = require('path');

const crearAlbum = async (req, res) => {
  try {
    const { nombre, artistaId } = req.body;
    const imagen = req.file;
    console.log(nombre, artistaId )
    // Crear álbum primero
    if (!imagen || !nombre || !artistaId) {
      return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
    }
    // Renombrar la imagen con el ID del álbum
    const extension = path.extname(imagen.originalname);
    const nuevoNombre = `${nombre}_${artistaId}${extension}`;
    const rutaDestino = path.join(__dirname, '../imagenesBackend', nuevoNombre);

    fs.renameSync(imagen.path, rutaDestino);

    const nuevoAlbum = await Album.create({
      nombre,
      imagen:nuevoNombre,
      artistaId });

    res.status(201).json(nuevoAlbum);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear álbum', error });
  }
};

const obtenerAlbums = async (req, res) => {
  try {
    const albums = await Album.findAll();
    res.json(albums);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener álbumes', error });
  }
};

const obtenerAlbumPorId = async (req, res) => {
  try {
    
    const album = await Album.findByPk(req.params.id);
    if (!album) return res.status(404).json({ mensaje: 'Álbum no encontrado' });
    res.json(album);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener álbum', error });
  }
};

const obtenerAlbumsPorArtista = async (req, res) => {
  try {
    const { artistaId } = req.params;

    const albums = await Album.findAll({
      where: { artistaId }
    });

    if (albums.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron álbumes para este artista' });
    }
    res.json(albums);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener álbumes del artista', error });
  }
};


const actualizarAlbum = async (req, res) => {
  try {
    const album = await Album.findByPk(req.params.id);
    if (!album) return res.status(404).json({ mensaje: 'Álbum no encontrado' });

    const nuevoNombre = req.body.nombre || album.nombre;
    const nuevoArtistaId = req.body.artistaId || album.artistaId;
    const nuevaImagen = req.file;

    let nombreImagenFinal = album.imagen; // nombre actual por defecto

    // Si hay una nueva imagen
    if (nuevaImagen) {
      // Borrar la imagen vieja
      const rutaVieja = path.join('imagenesBackend', album.imagen);
      if (fs.existsSync(rutaVieja)) fs.unlinkSync(rutaVieja);

      // Guardar con nuevo nombre
      const extension = path.extname(nuevaImagen.originalname);
      nombreImagenFinal = `${nuevoNombre}_${nuevoArtistaId}${extension}`;
      const rutaNueva = path.join('imagenesBackend', nombreImagenFinal);
      fs.renameSync(nuevaImagen.path, rutaNueva);
    }

    // Si solo cambió el nombre (y no se envió nueva imagen)
    else if (nuevoNombre !== album.nombre || nuevoArtistaId !== album.artistaId) {
      const rutaVieja = path.join('imagenesBackend', album.imagen);
      const extension = path.extname(album.imagen);
      nombreImagenFinal = `${nuevoNombre}_${nuevoArtistaId}${extension}`;
      const rutaNueva = path.join('imagenesBackend', nombreImagenFinal);

      if (fs.existsSync(rutaVieja)) {
        fs.renameSync(rutaVieja, rutaNueva);
      }
    }

    // Actualizar los datos en el modelo
    album.nombre = nuevoNombre;
    album.artistaId = nuevoArtistaId;
    album.imagen = nombreImagenFinal;

    await album.save();
    res.json(album);

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar álbum', error });
  }
};

const eliminarAlbum = async (req, res) => {
  try {
    const album = await Album.findByPk(req.params.id);
    if (!album) return res.status(404).json({ mensaje: 'Álbum no encontrado' });

    const rutaImagen = path.join('imagenesBackend', album.imagen);
    if (fs.existsSync(rutaImagen)) fs.unlinkSync(rutaImagen);

    await album.destroy();
    res.json({ mensaje: 'Álbum eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar álbum', error });
  }
};

module.exports = {
  crearAlbum,
  obtenerAlbums,
  obtenerAlbumPorId,
  obtenerAlbumsPorArtista,
  actualizarAlbum,
  eliminarAlbum
};
