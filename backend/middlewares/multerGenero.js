const multer = require('multer');
const path = require('path');
const fs = require('fs');

const carpetaDestino = 'imagenesBackend';

// Asegúrate que la carpeta exista
if (!fs.existsSync(carpetaDestino)) {
  fs.mkdirSync(carpetaDestino);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, carpetaDestino);
  },
  filename: (req, file, cb) => {
    // Nombre temporal, luego se renombra en el controlador
    const extension = path.extname(file.originalname);
    const nombreTemporal = Date.now() + extension;
    cb(null, nombreTemporal);
  }
});

const uploadImagenGenero = multer({ storage });

module.exports = uploadImagenGenero;
