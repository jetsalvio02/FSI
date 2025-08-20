import Reports from "../model/reports_model.js";
import fs from "fs";
import path from "path";

const Reports_Controller = {
  Create_Report: async (req, res) => {
    // Guard
    console.log("got req.file:", req.file);
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No image uploaded under field ‘photo_url’" });
    }

    console.log(Object.keys(req.file));

    const reportData = {
      user_id: req.body.user_id,
      photo_url: req.file.filename,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      description: req.body.description,
    };

    try {
      await Reports.Create_Report(reportData);
      console.log(reportData.photo_url);
      res.status(201).json({
        message: "Report created successfully",
        data: reportData,
      });
    } catch (error) {
      console.error("Error creating report in controller : ", error);
      throw error;
    }
  },

  Report_Resolved: async (req, res) => {
    const { id } = req.params;
    const { new_status } = req.body;

    console.log("Body:", req.body);
    console.log("File:", req.file);

    if (!req.file) {
      return res.status(400).json({
        message: "No proof photo uploaded under field 'proof_photo_url' ",
      });
    }

    try {
      const proof_photo_file_path = req.file ? req.file.filename : null;

      const updated = await Reports.Report_Resolved(
        id,
        new_status,
        proof_photo_file_path
      );

      if (!updated) {
        return res.status(404).json({ message: "Report not found" });
      }

      res.status(200).json({
        message: "Report resolved successfully",
        proof_photo_url: proof_photo_file_path,
      });
    } catch (error) {
      console.error("Error resolving report_resolved in controller:", error);
      res.status(500).json({ message: "Server error", error });
    }
  },

  Delete_Report: async (req, res) => {
    const { id } = req.params;
    try {
      // 1. Fetch report by ID to get photo filename
      const report = await Reports.Select_Report_By_Id(id);

      console.log(report.photo_url);

      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }

      // 2. Delete the image from disk
      const imagePath = path.join(
        "uploads",
        "reports_images",
        report.photo_url
      );

      console.log(imagePath);

      fs.unlink(imagePath, async (err) => {
        if (err) {
          console.error("Error deleting image:", err);
          // Optional: continue deletion even if image not found
        }

        // 3. Delete the report from the database
        await Reports.Delete_Report(id);

        res.status(200).json({
          message: "Report and image deleted successfully",
        });
      });
    } catch (error) {
      console.log("Error deleting report in controller: ", error);
    }
  },

  Select_All_Reports: async (req, res) => {
    try {
      const reports = await Reports.Select_All_Reports();
      res.status(200).json({
        message: "Reports fetched sucessfully",
        reports: reports,
      });
    } catch (error) {
      console.log("Error selecting all reports in controller: ", error);
      throw error;
    }
  },

  Select_User_Report_By_Id: async (req, res) => {
    const { id } = req.params;
    try {
      const report = await Reports.Select_User_Reports_By_Id(id);
      res.status(200).json({
        message: "Report users by id fetched sucessfully",
        report: report,
      });
    } catch (error) {
      console.log("Error selecting report by id in controller: ", error);
      throw error;
    }
  },

  Select_Report_By_Id: async (req, res) => {
    const { id } = req.params;
    try {
      const report = await Reports.Select_Report_By_Id(id);
      res.status(200).json({
        message: "Report by id fetched sucessfully",
        data: report,
      });
    } catch (error) {
      console.log("Error selecting report by id in controller: ", error);
      throw error;
    }
  },

  Select_Report_Pending: async (req, res) => {
    try {
      const report = await Reports.Select_Report_Pending();
      res.status(200).json(report);
    } catch (error) {
      console.log("Error selecting Pending report in controller: ", error);
    }
  },

  Select_Report_In_Progress: async (req, res) => {
    try {
      const report = await Reports.Select_Report_In_Progress();
      res.status(200).json(report);
    } catch (error) {
      console.log("Error selecting In Progress report in controller: ", error);
    }
  },

  Select_Report_Resolved: async (req, res) => {
    try {
      const report = await Reports.Select_Report_Resolved();
      res.status(200).json(report);
    } catch (error) {
      console.log("Error selecting Resolved report in controller: ", error);
    }
  },

  Update_Report_Status: async (req, res) => {
    const { id } = req.params;
    const { newStatus } = req.body;
    try {
      await Reports.Update_Report_Status(id, newStatus);
      res.status(200).json({
        message: "Report status updated successfully",
      });
    } catch (error) {
      console.log("Error updating report status in controller: ", error);
    }
  },

  User_Stats_Report: async (req, res) => {
    try {
      const users_stats = await Reports.User_Stats_Reports();
      res.status(200).json({ users_stats: users_stats });
    } catch (error) {
      console.log("Error in User Stats Report in Controller", error);
      throw error;
    }
  },
};

export default Reports_Controller;
