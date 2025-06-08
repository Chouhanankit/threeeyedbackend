const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

enquirySchema.virtual("formattedDate").get(function () {
  const date = this.createdAt;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
});

enquirySchema.set("toJSON", { virtuals: true });
enquirySchema.set("toObject", { virtuals: true });

const Enquiry = mongoose.model("Enquiry", enquirySchema);

module.exports = Enquiry;
