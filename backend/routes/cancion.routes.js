const express = require('express');
const router = express.Router();
const cancionController = require('../controllers/cancion.controller');
const uploadCancion = require('../middlewares/multerCancion');

//http://localhost:3000/api/canciones/
router.post('/', uploadCancion.single('audio'), cancionController.crearCancion);

router.get('/', cancionController.obtenerCanciones);

router.get('/:id', cancionController.obtenerCancionPorId);

router.get('/album/:albumId', cancionController.obtenerCancionesPorAlbum);

router.put('/:id', uploadCancion.single('audio'), cancionController.actualizarCancion);

router.delete('/:id', cancionController.eliminarCancion);

module.exports = router;
