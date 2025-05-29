const express = require("express");
const multer = require("multer");
const { mailsender, MailSenderRec } = require("../controller/userController");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");


router.post("/register/mail", mailsender);
router.post("/join/team", upload.single("resume"), MailSenderRec);

module.exports = router;
