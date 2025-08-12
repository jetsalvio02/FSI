import connection from "../config/database.js";

const Reports = {
  Create_Reports_Table: async () => {
    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        photo_url VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        latitude DECIMAL(10,7) NOT NULL,
        longitude DECIMAL(10,7) NOT NULL,
        status ENUM('Pending','In Progress','Resolved') NOT NULL DEFAULT 'Pending',
        created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (user_id) REFERENCES users(id)
            ON DELETE CASCADE)
        `);
      console.log("Reports table created or already exists");
    } catch (error) {
      console.error("Error creating users table:", error);
      throw error;
    }
  },

  Create_Report: async (reportData) => {
    try {
      const [result] = await connection.query(
        "INSERT INTO reports (user_id, photo_url, latitude,  longitude, description) VALUES (?, ?, ?, ?, ?)",
        [
          reportData.user_id,
          reportData.photo_url,
          reportData.latitude,
          reportData.longitude,
          reportData.description,
        ]
      );
      return result.insertId;
    } catch (error) {
      console.error("Error creating report in model : ", error);
      throw error;
    }
  },

  Delete_Report: async (id) => {
    try {
      const [result] = await connection.query(
        "DELETE FROM reports WHERE id = ?",
        [id]
      );
      return result.affectedRows;
    } catch (error) {
      console.log("Error deleting report in model: ", error);
    }
  },

  Select_All_Reports: async () => {
    try {
      const [rows] = await connection.query(
        "SELECT reports.*, users.email, (SELECT COUNT(DISTINCT id) FROM users) AS total_users FROM reports JOIN users ON reports.user_id = users.id;"
      );
      return rows;
    } catch (error) {
      console.log("Error selecting all report in model: ", error);
      throw error;
    }
  },

  Select_User_Reports_By_Id: async (id) => {
    try {
      const [rows] = await connection.query(
        "SELECT * FROM reports WHERE user_id = ?",
        [id]
      );
      return rows;
    } catch (error) {
      console.log("Error selecting report by id in model: ", error);
      throw error;
    }
  },

  Select_Report_By_Id: async (id) => {
    try {
      const [rows] = await connection.query(
        "SELECT * FROM reports WHERE id = ?",
        [id]
      );
      return rows[0];
    } catch (error) {
      console.log("Error selecting report by id in model: ", error);
      throw error;
    }
  },

  Select_Report_Pending: async () => {
    try {
      const [rows] = await connection.query(
        "SELECT * FROM reports WHERE status = 'Pending'"
      );
      return rows;
    } catch (error) {
      console.log("Error selectiing Pending report in model: ", error);
    }
  },

  Select_Report_In_Progress: async () => {
    try {
      const [rows] = await connection.query(
        "SELECT * FROM reports WHERE status = 'In Progress'"
      );
      return rows;
    } catch (error) {
      console.log("Error selectiing In Progress report in model: ", error);
    }
  },

  Select_Report_Resolved: async () => {
    try {
      const [rows] = await connection.query(
        "SELECT * FROM reports WHERE status = 'Resolved'"
      );
      return rows;
    } catch (error) {
      console.log("Error selectiing Resolved report in model: ", error);
    }
  },

  Update_Report_Status: async (id, status) => {
    try {
      const [result] = await connection.query(
        "UPDATE reports SET status = ? WHERE id = ?",
        [status, id]
      );
      return result.affectedRows;
    } catch (error) {
      console.log("Error updating report status in model: ", error);
    }
  },

  User_Stats_Reports: async () => {
    try {
      const [result] =
        await connection.query(`SELECT users.email, COUNT(*) AS reports, 
        ROUND(SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END ) / COUNT(*) * 100, 0) AS completion
        FROM reports JOIN users ON reports.user_id = users.id GROUP BY email ORDER BY reports DESC`);
      return result;
    } catch (error) {
      console.log("Error in User Stats Report in Model", error);
      throw error;
    }
  },
};

export default Reports;
