const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const Enquiry = require("../models/Enquiry");
const JobApplication = require("../models/JobApplication");

const mailsender = asyncHandler(async (req, res) => {
  console.log("Incoming Request Body:", req.body);

  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !phone || !subject || !message) {
    res.status(400);
    throw new Error("Please fill in all required fields.");
  }

  if (!process.env.EMAIL_USER || !process.env.PASS_KEY) {
    throw new Error("Email credentials are not set in environment variables.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.PASS_KEY,
    },
  });

  // ✅ Internal Team Email Content
  const teamHtml = `
    <div style="font-family: 'Segoe UI', sans-serif; padding: 20px; color: #333;">
      <div style="text-align: start; margin-bottom: 20px;">
        <img src="https://ik.imagekit.io/mcyibc35n/2%20(1).png?updatedAt=1748161705033" alt="Three-Eyed Pvt. Ltd. Logo" style="max-width: 180px;" />
      </div>
      <h2 style="color: #EA7900;">New Enquiry Received</h2>
      <p style="margin-top: 10px; font-size: 16px;">A new enquiry has been submitted through your website contact form. Here are the details:</p>
      <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
        <tr><td style="padding: 10px; background-color: #f5f5f5; font-weight: bold;">Name:</td><td style="padding: 10px;">${name}</td></tr>
        <tr><td style="padding: 10px; background-color: #f5f5f5; font-weight: bold;">Email:</td><td style="padding: 10px;">${email}</td></tr>
        <tr><td style="padding: 10px; background-color: #f5f5f5; font-weight: bold;">Phone:</td><td style="padding: 10px;">${phone}</td></tr>
        <tr><td style="padding: 10px; background-color: #f5f5f5; font-weight: bold;">Subject:</td><td style="padding: 10px;">${subject}</td></tr>
        <tr><td style="padding: 10px; background-color: #f5f5f5; font-weight: bold;">Message:</td><td style="padding: 10px;">${message}</td></tr>
      </table>
      <hr style="margin: 30px 0;" />
      <p style="font-size: 13px; color: #888;">This enquiry was submitted via the contact form on the <strong>Three-Eyed Pvt. Ltd.</strong> website.</p>
    </div>
  `;

  // ✅ Confirmation Email to User
  const userHtml = `
    <div style="font-family: 'Segoe UI', sans-serif; padding: 20px; color: #333;">
      <div style="text-align: start; margin-bottom: 20px;">
        <img src="https://ik.imagekit.io/mcyibc35n/2%20(1).png?updatedAt=1748161705033" alt="Three-Eyed Pvt. Ltd. Logo" style="max-width: 180px;" />
      </div>
      <h2 style="color: #EA7900;">Thank You for Contacting Us, ${name}!</h2>
      <p style="margin-top: 10px; font-size: 16px;">
        We’ve received your enquiry regarding <strong>"${subject}"</strong>.
        <br /><br />
        Our team will review your message and get back to you as soon as possible.
      </p>
      <hr style="margin: 30px 0;" />
      <p style="font-size: 13px; color: #888;">This is a confirmation email from <strong>Three-Eyed Pvt. Ltd.</strong>.</p>
    </div>
  `;

  try {
    //  Save to MongoDB
    await Enquiry.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    //  Send to Admin
    await transporter.sendMail({
      from: '"Three-Eyed Pvt. Ltd." <threeeyed.om@gmail.com>',
      to: "threeeyed.om@gmail.com",
      subject: `New Enquiry: ${subject}`,
      html: teamHtml,
    });

    //  Send to User
    await transporter.sendMail({
      from: '"Three-Eyed Pvt. Ltd." <threeeyed.om@gmail.com>',
      to: email,
      subject: `We've received your enquiry – Three-Eyed Pvt. Ltd.`,
      html: userHtml,
    });

    res
      .status(200)
      .json({ message: "Enquiry successfully sent to our team.." });
  } catch (error) {
    console.error("Email send failed:", error);
    res.status(500).json({ message: "Failed to send email." });
  }
});

const MailSenderRec = asyncHandler(async (req, res) => {
  console.log("Incoming Request Body:", req.body);
  const {
    firstName,
    lastName,
    email,
    phone,
    position,
    skills,
    employment_status,
  } = req.body;

  const resumeFile = req.file;

  if (!resumeFile) {
    return res.status(400).json({ error: "Resume file is missing" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.PASS_KEY,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `Job Application - ${position}`,
    html: `
      <table style="width: 60%; font-family: Arial, sans-serif; border-collapse: collapse;">
        <tr>
          <td style="padding: 20px; background-color: #f7f7f7;">
            <h2 style="color: #EA7900;">New Team Application</h2>
            <p>A new user has submitted the "Join Our Team" form:</p>

            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <tr>
                <td style="padding: 8px; border: 1px solid #ccc;"><strong>Name</strong></td>
                <td style="padding: 8px; border: 1px solid #ccc;">${firstName} ${lastName}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ccc;"><strong>Email</strong></td>
                <td style="padding: 8px; border: 1px solid #ccc;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ccc;"><strong>Phone</strong></td>
                <td style="padding: 8px; border: 1px solid #ccc;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ccc;"><strong>Position</strong></td>
                <td style="padding: 8px; border: 1px solid #ccc;">${position}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ccc;"><strong>Skills</strong></td>
                <td style="padding: 8px; border: 1px solid #ccc;">${skills}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ccc;"><strong>Employment Status</strong></td>
                <td style="padding: 8px; border: 1px solid #ccc;">${employment_status}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ccc;"><strong>Resume</strong></td>
                <td style="padding: 8px; border: 1px solid #ccc;">Attached: ${resumeFile.originalname}</td>
              </tr>
            </table>

            <p style="margin-top: 20px;">Best regards,<br><strong>The Join Team Bot</strong></p>
          </td>
        </tr>
      </table>
    `,
    attachments: [
      {
        filename: resumeFile.originalname,
        path: resumeFile.path,
        contentType: resumeFile.mimetype,
      },
    ],
  };

  try {
    //  Save to MongoDB
    await JobApplication.create({
      firstName,
      lastName,
      email,
      phone,
      position,
      skills,
      employment_status,
      resumeFileName: resumeFile.originalname,
    });

    //  Send email
    await transporter.sendMail(mailOptions);

    //  Optional: Delete uploaded file
    await fs.promises.unlink(resumeFile.path);

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email error:", error.message, error.stack);
    res.status(500).json({ error: "Failed to send email." });
  }
});
module.exports = { mailsender, MailSenderRec };
