import React, { useState, useEffect } from "react";

// Component to display pending company requests
export default function PendingRequests() {
  const [companies, setCompanies] = useState([]);

  // Load placeholder data
  useEffect(() => {
    setCompanies([
      {
        id: 1,
        logo_url: "https://via.placeholder.com/64",
        name: "Tech Solutions",
        short_description: "IT services and consulting",
        created_at: "2025-08-15",
        company_code: "TS123",
      },
      {
        id: 2,
        logo_url: "https://via.placeholder.com/64",
        name: "Green Energy",
        short_description: "Renewable energy provider",
        created_at: "2025-08-14",
        company_code: "GE456",
      },
    ]);
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {companies.map((company) => (
        <div key={company.id} className="bg-white shadow-lg rounded p-4">
          <img src={company.logo_url} alt={company.name} className="w-16 h-16 mb-3" />
          <h3 className="font-bold">{company.name}</h3>
          <p>{company.short_description}</p>
          <p className="text-sm text-gray-500">Submitted: {company.created_at}</p>
          <p className="text-sm">Code: {company.company_code}</p>
          <div className="flex gap-2 mt-4">
            <button className="bg-green-500 text-white px-3 py-1 rounded">✅ Accept</button>
            <button className="bg-red-500 text-white px-3 py-1 rounded">❌ Deny</button>
          </div>
        </div>
      ))}
    </div>
  );
}
