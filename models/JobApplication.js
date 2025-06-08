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

applicationSchema.virtual("formattedDate").get(function () {
  const date = this.createdAt;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
});

applicationSchema.set("toJSON", { virtuals: true });
applicationSchema.set("toObject", { virtuals: true });

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
