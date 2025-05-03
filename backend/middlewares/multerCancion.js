// middlewares/uploadCancion.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const carpetaCanciones = 'cancionesBackend';
if (!fs.existsSync(carpetaCanciones)) {
  fs.mkdirSync(carpetaCanciones);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, carpetaCanciones);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const nombreTemporal = Date.now() + extension;
    cb(null, nombreTemporal);
  }
});

const uploadCancion = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname) !== '.mp3') {
      return cb(new Error('Solo se permiten archivos .mp3'));
    }
    cb(null, true);
  }
});

module.exports = uploadCancion;
