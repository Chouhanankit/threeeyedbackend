const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    position: { type: String, required: true },
    skills: { type: String, required: true },
    employment_status: { type: String, required: true },
    resumeFileName: { type: String, required: true },
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
