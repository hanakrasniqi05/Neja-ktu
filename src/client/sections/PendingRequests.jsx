import React, { useState, useEffect } from "react";
import axios from "axios";
import {Mail,Phone,Globe,MapPin,Building2,Check,X,} from "lucide-react";

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
      setCompanies(companies.filter((c) => c.id !== id));
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
      setCompanies(companies.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error denying company:", err);
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {companies.length === 0 ? (
        <p className="text-gray-500">No pending requests.</p>
      ) : (
        companies.map((company) => (
          <div
            key={company.id}
            className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
          >
            <img
              src={company.logo_path || "https://via.placeholder.com/128"}
              alt={company.company_name}
              className="w-32 h-32 mb-4 object-cover rounded-lg border border-gray-200"
            />
            <h3 className="font-semibold text-lg text-gray-800 mb-2">
              {company.company_name}
            </h3>
            <p className="text-sm text-gray-600 mb-4">{company.description}</p>

            <div className="space-y-1 text-sm text-gray-700 w-full">
              <p className="flex items-center justify-center gap-2">
                <Mail size={16} /> {company.company_email}
              </p>
              <p className="flex items-center justify-center gap-2">
                <Phone size={16} /> {company.phone_number}
              </p>
              <p className="flex items-center justify-center gap-2">
                <Globe size={16} /> {company.website}
              </p>
              <p className="flex items-center justify-center gap-2">
                <MapPin size={16} /> {company.address}
              </p>
              <p className="flex items-center justify-center gap-2 font-medium">
                <Building2 size={16} /> Business Code:{" "}
                {company.business_registration_number}
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleApprove(company.id)}
                className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
              >
                <Check size={16} /> Accept
              </button>
              <button
                onClick={() => handleDeny(company.id)}
                className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
              >
                <X size={16} /> Deny
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}