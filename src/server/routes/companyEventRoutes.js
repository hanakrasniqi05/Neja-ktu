const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventControllerCompany");
const { protect, requireRole, verifyCompanyVerified } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

// Config multer 
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Routes 
router.post("/", protect, requireRole("company"), verifyCompanyVerified, upload.single("image"), eventController.createEvent);
router.get("/", protect, requireRole("company"), verifyCompanyVerified, eventController.getEventsByCompany);
router.put("/:id", protect, requireRole("company"), verifyCompanyVerified, upload.single("image"), eventController.updateEvent);
router.delete("/:id", protect, requireRole("company"), verifyCompanyVerified, eventController.deleteEvent);

module.exports = router;
