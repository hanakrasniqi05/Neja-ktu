import React, { useState, useEffect } from "react";
import axios from "axios";

// Component to display pending company requests
export default function PendingRequests() {
  const [companies, setCompanies] = useState([]);

  // Fetch pending companies from backend
  useEffect(() => {
    const fetchPendingCompanies = async () => {
      try {
        const token = localStorage.getItem("token"); // JWT i adminit
        const res = await axios.get("http://localhost:5000/api/admin/companies/pending", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCompanies(res.data);
      } catch (err) {
        console.error("Error fetching pending companies:", err);
      }
    };

    fetchPendingCompanies();
  }, []);

  // Approve company
  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/admin/companies/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // remove company from pending list
      setCompanies(companies.filter((c) => c.CompanyId !== id));
    } catch (err) {
      console.error("Error approving company:", err);
    }
  };

  // Deny company
  const handleDeny = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/admin/companies/${id}/deny`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // remove company from pending list
      setCompanies(companies.filter((c) => c.CompanyId !== id));
    } catch (err) {
      console.error("Error denying company:", err);
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {companies.length === 0 ? (
        <p className="text-gray-500">No pending requests.</p>
      ) : (
        companies.map((company) => (
          <div key={company.CompanyId} className="bg-white shadow-lg rounded p-4">
            <img
              src={company.logo_url || "https://via.placeholder.com/64"}
              alt={company.name}
              className="w-16 h-16 mb-3"
            />
            <h3 className="font-bold">{company.name}</h3>
            <p>{company.short_description}</p>
            <p className="text-sm text-gray-500">Submitted: {company.created_at}</p>
            <p className="text-sm">Code: {company.company_code}</p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleApprove(company.CompanyId)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                ✅ Accept
              </button>
              <button
                onClick={() => handleDeny(company.CompanyId)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                ❌ Deny
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
