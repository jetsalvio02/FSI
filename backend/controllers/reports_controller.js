import Reports from "../model/reports_model.js";

const Reports_Controller = {
  Create_Report: async (req, res) => {
    const reportData = {
      user_id: req.body.user_id,
      photo_url: req.file.filename,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      description: req.body.description,
    };

    try {
      await Reports.Create_Report(reportData);
      res.status(201).json({
        message: "Report created successfully",
        data: reportData,
      });
    } catch (error) {
      console.error("Error creating report in controller : ", error);
      throw error;
    }
  },
};

export default Reports_Controller;
