const express = require('express');
const router = express.Router();
const cancionController = require('../controllers/cancion.controller');
const uploadCancion = require('../middlewares/multerCancion'); // para subir archivos .mp3
//http://localhost:3000/api/canciones/
// Crear canción
router.post('/', uploadCancion.single('audio'), cancionController.crearCancion);

// Obtener todas las canciones
router.get('/', cancionController.obtenerCanciones);

// Obtener una canción por ID
router.get('/:id', cancionController.obtenerCancionPorId);

// Obtener todas las canciones de un álbum
router.get('/album/:albumId', cancionController.obtenerCancionesPorAlbum);

// Actualizar una canción
router.put('/:id', uploadCancion.single('audio'), cancionController.actualizarCancion);

// Eliminar una canción
router.delete('/:id', cancionController.eliminarCancion);

module.exports = router;
