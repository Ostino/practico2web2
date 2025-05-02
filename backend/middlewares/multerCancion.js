const multer = require('multer');
const path = require('path');
const fs = require('fs');

const carpetaDestino = 'archivosMp3';
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
    cb(null, nombreTemporal); // luego se renombra en el controlador
  }
});

const uploadCancion = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'audio/mpeg') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos MP3'));
    }
  }
});

module.exports = uploadCancion;
