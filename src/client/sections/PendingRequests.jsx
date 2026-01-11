import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Mail, Phone, Globe, MapPin, Building2, Check, X,
} from "lucide-react";

export default function PendingRequests() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchPendingCompanies = async () => {
      try {
        const token = localStorage.getItem("token");
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

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/admin/companies/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompanies(companies.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error approving company:", err);
    }
  };

  const handleDeny = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/admin/companies/${id}/deny`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompanies(companies.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error denying company:", err);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl font-bold mb-4 md:mb-6">Pending Requests</h2>
      
      {companies.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No pending requests.</p>
          <p className="text-gray-400 text-sm mt-2">All requests have been processed</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {companies.map((company) => (
            <div
              key={company.id}
              className="bg-white shadow-md rounded-xl p-4 md:p-6 flex flex-col hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-4">
                <img
                  src={company.logo_path || "https://via.placeholder.com/128"}
                  alt={company.company_name}
                  className="w-20 h-20 md:w-32 md:h-32 object-cover rounded-lg border border-gray-200"
                />
                <div className="text-center md:text-left">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
                    {company.company_name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {company.description}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-700 mb-4">
                <p className="flex items-start gap-2">
                  <Mail size={16} className="flex-shrink-0 mt-0.5" />
                  <span className="truncate">{company.company_email}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={16} /> {company.phone_number}
                </p>
                <p className="flex items-start gap-2">
                  <Globe size={16} className="flex-shrink-0 mt-0.5" />
                  <span className="truncate">{company.website}</span>
                </p>
                <p className="flex items-start gap-2">
                  <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{company.address}</span>
                </p>
                <p className="flex items-center gap-2 font-medium">
                  <Building2 size={16} /> 
                  <span className="truncate">ID: {company.business_registration_number}</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-auto pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleApprove(company.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg text-sm transition-colors font-medium"
                >
                  <Check size={18} /> Accept
                </button>
                <button
                  onClick={() => handleDeny(company.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg text-sm transition-colors font-medium"
                >
                  <X size={18} /> Deny
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}