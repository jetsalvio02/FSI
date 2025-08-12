import Express from "express";
import Reports_Controller from "../controllers/reports_controller.js";
import { upload_report_image } from "../utility/multer.js";

const router = Express.Router();

router.post(
  "/create_report",
  upload_report_image.single("photo_url"),
  Reports_Controller.Create_Report
);

router.delete("/delete_report/:id", Reports_Controller.Delete_Report);

router.get("/pending_reports", Reports_Controller.Select_Report_Pending);
router.get(
  "/in_progress_reports",
  Reports_Controller.Select_Report_In_Progress
);
router.get("/resolved_reports", Reports_Controller.Select_Report_Resolved);

router.get("/get_all_reports", Reports_Controller.Select_All_Reports);

router.get("/report_by_id/:id", Reports_Controller.Select_Report_By_Id);

router.get(
  "/report_by_user_id/:id",
  Reports_Controller.Select_User_Report_By_Id
);

router.get("/get_users_stats", Reports_Controller.User_Stats_Report);

router.put(
  "/update_status_report/:id",
  Reports_Controller.Update_Report_Status
);

export default router;
