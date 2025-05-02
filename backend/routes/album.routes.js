const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album.controller');
const uploadImagenAlbum = require('../middlewares/multerAlbum');

// Crear un álbum (requiere imagen y artistaId)
router.post('/', uploadImagenAlbum.single('imagen'), albumController.crearAlbum);

// Obtener todos los álbumes
router.get('/', albumController.obtenerAlbums);

// Obtener un álbum por ID
router.get('/:id', albumController.obtenerAlbumPorId);

// Obtener álbumes por ID de artista
router.get('/artista/:artistaId', albumController.obtenerAlbumsPorArtista);

// Actualizar un álbum (puede incluir imagen)
router.put('/:id', uploadImagenAlbum.single('imagen'), albumController.actualizarAlbum);

// Eliminar un álbum
router.delete('/:id', albumController.eliminarAlbum);

module.exports = router;
