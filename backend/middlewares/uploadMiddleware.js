import multer from "multer";
import path from "path";
import fs from "fs";

// Crear carpeta "uploads" si no existe
const uploadPath = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Nombre único: timestamp + extensión original
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Solo se permiten imágenes"), false);
};

const upload = multer({ storage, fileFilter });

export default upload;
