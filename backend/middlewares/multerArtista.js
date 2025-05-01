const multer = require('multer');
const path = require('path');
const fs = require('fs');

const carpetaDestino = 'imagenesBackend';

// Crear la carpeta si no existe
if (!fs.existsSync(carpetaDestino)) {
  fs.mkdirSync(carpetaDestino, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, carpetaDestino);
  },
  filename: (req, file, cb) => {
    // Nombre temporal (por timestamp), luego será renombrado en el controlador
    const extension = path.extname(file.originalname);
    const nombreTemporal = Date.now() + extension;
    cb(null, nombreTemporal);
  }
});

const uploadImagen = multer({ storage });

module.exports = uploadImagen;
