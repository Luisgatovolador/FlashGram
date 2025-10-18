// middlewares/uploadMiddleware.js
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  console.log("📸 Recibido:", file.originalname, file.mimetype);
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Solo se permiten imágenes"), false);
};

const upload = multer({ storage, fileFilter });

// ✅ Middleware personalizado que captura errores y evita crash
export const uploadSingleImage = (req, res, next) => {
  const singleUpload = upload.single("image");
  singleUpload(req, res, (err) => {
    if (err) {
      console.error("❌ Error en subida:", err.message);
      return res.status(400).json({ message: "Solo se permiten imágenes" });
    }
    next();
  });
};
