import Express from "express";
import Cors from "cors";

// Tables
import User from "./model/user_model.js";
import Reports from "./model/reports_model.js";

// Routes
import User_Routes from "./routes/user_routes.js";
import Reports_Routes from "./routes/reports_routes.js";

const app = Express();

app.use(Express.json());
app.use(Cors());

// Tables
User.Create_User_Table();
Reports.Create_Reports_Table();

// API
app.use("/api/", User_Routes);
app.use("/api/", Reports_Routes);

app.listen(4000, () => console.log("Server running on 4000"));
