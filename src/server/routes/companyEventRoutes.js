const express = require("express");
const router = express.Router();
const eventControllerCompany = require("../controllers/eventControllerCompany");
const { protect, requireRole, verifyCompanyVerified } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploads"); 

// Routes 
router.post("/", protect, requireRole("company"), verifyCompanyVerified, upload.single("image"), eventControllerCompany.createEvent);
router.get("/my-events", protect, requireRole("company"), verifyCompanyVerified, eventControllerCompany.getEventsByCompany);
router.put("/:id", protect, requireRole("company"), verifyCompanyVerified, upload.single("image"), eventControllerCompany.updateEvent);
router.delete("/:id", protect, requireRole("company"), verifyCompanyVerified, eventControllerCompany.deleteEvent);

module.exports = router;
