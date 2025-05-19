import Express from "express";
import Reports_Controller from "../controllers/reports_controller.js";
import { upload_report_image } from "../utility/multer.js";

const router = Express.Router();

router.post(
  "/create_report",
  upload_report_image.single("photo_url"),
  Reports_Controller.Create_Report
);

export default router;
