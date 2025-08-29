const express = require("express");
const {
  getPendingCompanies,
  getAllCompanies,
  getAcceptedCompanies,
  getDeniedCompanies,
  approveCompany,
  denyCompany,
  deleteCompany,
  updateCompanyStatus
} = require("../controllers/adminController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Get companies by status
router.get("/companies/pending", protect, adminOnly, getPendingCompanies);
router.get("/companies/all", protect, adminOnly, getAllCompanies);
router.get("/companies/accepted", protect, adminOnly, getAcceptedCompanies);
router.get("/companies/denied", protect, adminOnly, getDeniedCompanies);

// Update company verification status
router.patch("/companies/:id/approve", protect, adminOnly, approveCompany);
router.patch("/companies/:id/deny", protect, adminOnly, denyCompany);
router.put("/companies/:id/status", protect, adminOnly, updateCompanyStatus);

// Delete company
router.delete("/companies/:id", protect, adminOnly, deleteCompany);

module.exports = router;
