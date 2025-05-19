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
};

export default Reports;
