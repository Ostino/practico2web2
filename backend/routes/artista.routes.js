const express = require('express');
const router = express.Router();
const artistaController = require('../controllers/artista.controller');
const upload = require('../middlewares/multerArtista');

//http://localhost:3000/api/artistas/
router.post('/', upload.single('imagen'), artistaController.crearArtista);

router.get('/', artistaController.obtenerArtistas);

router.get('/:id', artistaController.obtenerArtistaPorId);

router.put('/:id', upload.single('imagen'), artistaController.actualizarArtista);

router.delete('/:id', artistaController.eliminarArtista);

router.get('/genero/:id', artistaController.obtenerArtistasPorGenero);

module.exports = router;
