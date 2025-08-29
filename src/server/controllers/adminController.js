const pool = require("../database");

// GET ALL COMPANIES 
const getAllCompanies = async (req, res) => {
  try {
    // Fetch all companies from database
    const [rows] = await pool.query("SELECT * FROM companies");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching companies:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET PENDING COMPANIES 
const getPendingCompanies = async (req, res) => {
  try {
    // Only companies with verification_status = 'pending'
    const [rows] = await pool.query(
      "SELECT * FROM companies WHERE verification_status = 'pending'"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching pending companies:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET ACCEPTED COMPANIES 
const getAcceptedCompanies = async (req, res) => {
  try {
    // Only companies with verification_status = 'verified'
    const [rows] = await pool.query(
      "SELECT * FROM companies WHERE verification_status = 'verified'"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching accepted companies:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET DENIED COMPANIES 
const getDeniedCompanies = async (req, res) => {
  try {
    // Only companies with verification_status = 'rejected'
    const [rows] = await pool.query(
      "SELECT * FROM companies WHERE verification_status = 'rejected'"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching denied companies:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// APPROVE COMPANY 
const approveCompany = async (req, res) => {
  try {
    const { id } = req.params;
    // Update company status to 'verified'
    await pool.query(
      "UPDATE companies SET verification_status = 'verified' WHERE id = ?",
      [id]
    );
    res.json({ success: true, message: "Company approved" });
  } catch (err) {
    console.error("Error approving company:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DENY COMPANY 
const denyCompany = async (req, res) => {
  try {
    const { id } = req.params;
    // Update company status to 'rejected'
    await pool.query(
      "UPDATE companies SET verification_status = 'rejected' WHERE id = ?",
      [id]
    );
    res.json({ success: true, message: "Company denied" });
  } catch (err) {
    console.error("Error denying company:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE COMPANY STATUS (EDIT) 
const updateCompanyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate that status is one of allowed values
    if (!["pending", "verified", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    // Update company verification_status
    await pool.query(
      "UPDATE companies SET verification_status = ? WHERE id = ?",
      [status, id]
    );

    res.json({ success: true, message: "Company status updated" });
  } catch (err) {
    console.error("Error updating company status:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE COMPANY 
const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    // Permanently delete company record
    await pool.query("DELETE FROM companies WHERE id = ?", [id]);
    res.json({ success: true, message: "Company deleted" });
  } catch (err) {
    console.error("Error deleting company:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getAllCompanies,
  getPendingCompanies,
  getAcceptedCompanies,
  getDeniedCompanies,
  approveCompany,
  denyCompany,
  updateCompanyStatus,
  deleteCompany,
};
