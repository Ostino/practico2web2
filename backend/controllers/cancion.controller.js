const fs = require('fs');
const path = require('path');
const Cancion = require('../models/cancion.model');

const crearCancion = async (req, res) => {
  try {
    const { albumId } = req.body;

    if (!req.file) {
      return res.status(400).json({ mensaje: 'No se proporcionó archivo mp3' });
    }

    const extension = path.extname(req.file.originalname);
    const nombreBase = path.basename(req.file.originalname, extension);

    // Creamos el registro sin el nombre aún para obtener el ID
    const nuevaCancion = await Cancion.create({
      archivo: '', // temporal
      albumId
    });

    const nuevoNombre = `${nombreBase}_${nuevaCancion.id}${extension}`;
    const nuevaRuta = path.join(req.file.destination, nuevoNombre);

    // Renombrar el archivo
    fs.renameSync(req.file.path, nuevaRuta);

    // Actualizar con el nuevo nombre
    nuevaCancion.archivo = nuevoNombre;
    await nuevaCancion.save();

    res.status(201).json(nuevaCancion);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear canción', error });
  }
};

const obtenerCancionesPorAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;
    const canciones = await Cancion.findAll({ where: { albumId } });
    res.json(canciones);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener canciones', error });
  }
};

const eliminarCancion = async (req, res) => {
  try {
    const cancion = await Cancion.findByPk(req.params.id);

    if (!cancion) {
      return res.status(404).json({ mensaje: 'Canción no encontrada' });
    }

    const ruta = path.join(__dirname, '../archivosMp3', cancion.archivo);
    if (fs.existsSync(ruta)) {
      fs.unlinkSync(ruta);
    }

    await cancion.destroy();

    res.json({ mensaje: 'Canción eliminada' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar canción', error });
  }
};
const obtenerCancionPorId = async (req, res) => {
    try {
      const cancion = await Cancion.findByPk(req.params.id);
      if (!cancion) {
        return res.status(404).json({ mensaje: 'Canción no encontrada' });
      }
      res.json(cancion);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener canción', error });
    }
  };
  const editarCancion = async (req, res) => {
    try {
      const { id } = req.params;
      const cancion = await Cancion.findByPk(id);
  
      if (!cancion) {
        return res.status(404).json({ mensaje: 'Canción no encontrada' });
      }
  
      // Si hay nuevo archivo .mp3, lo renombramos
      if (req.file) {
        const extension = path.extname(req.file.originalname);
        const nuevoNombre = `${path.parse(req.file.originalname).name}_${id}${extension}`;
        const nuevaRuta = path.join(req.file.destination, nuevoNombre);
  
        // Renombrar el archivo subido
        fs.renameSync(req.file.path, nuevaRuta);
  
        // Eliminar archivo anterior si existe y es distinto
        if (cancion.archivo && cancion.archivo !== nuevoNombre) {
          const rutaAntigua = path.join(req.file.destination, cancion.archivo);
          if (fs.existsSync(rutaAntigua)) {
            fs.unlinkSync(rutaAntigua);
          }
        }
  
        cancion.archivo = nuevoNombre;
      }
  
      // Guardar cambios
      await cancion.save();
      res.json({ mensaje: 'Canción actualizada correctamente', cancion });
  
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al editar la canción', error });
    }
  };
  
  
module.exports = {
  crearCancion,
  obtenerCancionesPorAlbum,
  eliminarCancion,
  obtenerCancionPorId,
  editarCancion 
};
