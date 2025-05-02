const express = require('express');
const router = express.Router();
const cancionController = require('../controllers/cancion.controller');
const uploadCancion = require('../middlewares/multerCancion');

router.post('/', uploadCancion.single('archivo'), cancionController.crearCancion);
router.get('/album/:albumId', cancionController.obtenerCancionesPorAlbum);
router.delete('/:id', cancionController.eliminarCancion);
router.get('/album/:albumId', cancionController.obtenerCancionPorId);
router.put('/:id', uploadCancion.single('archivo'), cancionController.editarCancion);


module.exports = router;
