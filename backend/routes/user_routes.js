import Express from "express";
import User_Controller from "../controllers/user_controller.js";
import user_token from "../middleware/user_token.js";

const router = Express.Router();

router.get("/user", user_token, User_Controller.Get_User_By_Id);
router.post("/create_user", User_Controller.Create_User);
router.get("/users", User_Controller.Get_All_Users);
router.post("/login_user", User_Controller.Login_User);

export default router;
