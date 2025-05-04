const express = require('express');
const router = express.Router();
const generoController = require('../controllers/genero.controller');
const uploadImagenGenero = require('../middlewares/multerGenero');

// http://localhost:3000/api/generos
router.post('/', uploadImagenGenero.single('imagen'), generoController.crearGenero);

router.get('/', generoController.obtenerGeneros);

router.get('/:id', generoController.obtenerGeneroPorId);

router.put('/:id', uploadImagenGenero.single('imagen'), generoController.actualizarGenero);

router.delete('/:id', generoController.eliminarGenero);

module.exports = router;
