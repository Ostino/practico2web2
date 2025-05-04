const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album.controller');
const uploadImagenAlbum = require('../middlewares/multerAlbum');

//http://localhost:3000/api/albumes/
router.post('/', uploadImagenAlbum.single('imagen'), albumController.crearAlbum);

router.get('/', albumController.obtenerAlbums);

router.get('/:id', albumController.obtenerAlbumPorId);

router.get('/artista/:artistaId', albumController.obtenerAlbumsPorArtista);

router.put('/:id', uploadImagenAlbum.single('imagen'), albumController.actualizarAlbum);

router.delete('/:id', albumController.eliminarAlbum);

module.exports = router;
