import User from "../model/user_model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const User_Controller = {
  Create_User: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are required (username, email, password)",
        });
      }

      // Check if user already exists
      //   const existingUser = await User.getUserByEmail(email);
      //   if (existingUser) {
      //     return res.status(409).json({
      //       success: false,
      //       message: "User already exists with this email",
      //     });
      //   }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user
      const newUser = {
        email,
        password_hash: hashedPassword,
      };

      const userId = await User.Create_User(newUser);

      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: {
          id: userId,
          email,
        },
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },
  // In your User_Controller
  Get_All_Users: async (req, res) => {
    try {
      const users = await User.Get_All_Users();

      res.status(200).json({
        success: true,
        count: users.length,
        data: users,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  Get_User_By_Id: async (req, res) => {
    try {
      const user = await User.Get_User_By_Id(req.user_id);
      res.status(200).json({
        user,
      });
    } catch (error) {
      console.error("Error fetching user by ID in controller:", error);
      throw error;
    }
  },

  Login_User: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.Login_User(email);

      // If user not found, User.Login_User should throw, or we can check
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Ensure password hash is present
      if (!user.password_hash) {
        return res.status(500).json({ message: "Password not set for user" });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }

      const secret_key = "secret";

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        secret_key
      );

      // console.log(user.user_id);

      return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      console.error("Error logging in user in controller: ", error);
    }
  },
};

export default User_Controller;
