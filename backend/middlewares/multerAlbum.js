const multer = require('multer');
const path = require('path');
const fs = require('fs');

const carpetaDestino = 'imagenesBackend';

if (!fs.existsSync(carpetaDestino)) {
  fs.mkdirSync(carpetaDestino);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, carpetaDestino);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const nombreTemporal = Date.now() + extension;
    cb(null, nombreTemporal);
  }
});

const uploadImagenAlbum = multer({ storage });

module.exports = uploadImagenAlbum;
