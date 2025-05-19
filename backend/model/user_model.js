import connection from "../config/database.js";

const User = {
  Create_User_Table: async () => {
    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL
        )
      `);
      console.log("Users table created or already exists");
    } catch (error) {
      console.error("Error creating users table:", error);
      throw error;
    }
  },

  // Create new user
  Create_User: async (userData) => {
    try {
      const [result] = await connection.query(
        "INSERT INTO users (email, password_hash) VALUES (?, ?)",
        [userData.email, userData.password_hash]
      );
      return result.insertId;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  // Get all users (new method)
  Get_All_Users: async () => {
    try {
      const [rows] = await connection.query("SELECT id, email FROM users");
      return rows;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  },

  Get_User_By_Id: async (user_id) => {
    try {
      const [rows] = await connection.query(
        "SELECT * FROM users WHERE id = ?",
        [user_id]
      );
      return rows[0];
    } catch (error) {
      console.error("Error user by ID in model:", error);
      throw error;
    }
  },

  Login_User: async (email) => {
    const query = `SELECT * FROM users WHERE email = ?`;
    try {
      const [user] = await connection.query(query, email);
      if (user.length === 0) {
        throw new Error("User not found");
      }
      return user[0];
    } catch (error) {
      console.error("Error logging in user in model: ", error);
      throw error;
    }
  },
};

export default User;
