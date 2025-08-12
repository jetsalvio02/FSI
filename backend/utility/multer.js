import Multer from "multer";
import { dirname, join, extname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = (folderName) =>
  Multer.diskStorage({
    destination: (req, file, cb) => {
      // ensure the folder exists (optional but recommended)
      // fs.mkdirSync(path.join(__dirname, 'uploads', folderName), { recursive: true });
      // cb(null, path.join(__dirname, "uploads", folderName));
      const uploadPath = path.resolve("uploads", folderName);
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const extension = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${timestamp}${extension}`);
    },
  });

const upload_report_image = Multer({
  storage: storage("reports_images"),
  // limits: { fileSize: 5 * 1024 * 1024 }, // optional
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only JPEG/PNG images are allowed"));
  },
});

export { upload_report_image };
