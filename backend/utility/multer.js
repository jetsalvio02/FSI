import Multer from "multer";
import path from "path";

// const storage = Multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, "/uploads"));
//   },
//   filename: (req, file, cb) => {
//     const timestap = Date.now();
//     const exstenion = path.extname(file.originalname);
//     cb(null, `${file.fieldname}-${timestap}${exstenion}`);
//   },
// });
// const upload_image_waste = Multer(storage: ());
const storage = (folderName) => {
  Multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `uploads/${folderName}/`);
    },
    filename: (req, file, cb) => {
      const timestap = Date.now();
      const exstenion = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${timestap}${exstenion}`);
    },
  });
};

const upload_report_image = Multer({
  storage: storage("reports_images"), // Upload images to 'uploads/images'
  // limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed"));
  },
});

export { upload_report_image };
