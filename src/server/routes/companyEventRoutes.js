const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventControllerCompany");
const { protect, requireRole, verifyCompanyVerified } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload"); 

// Routes 
router.post("/", protect, requireRole("company"), verifyCompanyVerified, upload.single("image"), eventController.createEvent);
router.get("/", protect, requireRole("company"), verifyCompanyVerified, eventController.getEventsByCompany);
router.put("/:id", protect, requireRole("company"), verifyCompanyVerified, upload.single("image"), eventController.updateEvent);
router.delete("/:id", protect, requireRole("company"), verifyCompanyVerified, eventController.deleteEvent);

module.exports = router;
