import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AcceptedCompanies() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/admin/companies/accepted", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCompanies(res.data);
      } catch (error) {
        console.error("Error fetching accepted companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  const handleRemoveFromAccepted = async (id) => {
  try {
    const token = localStorage.getItem("token");
    await axios.put(
      `http://localhost:5000/api/admin/companies/${id}/status`,
      { status: "verified" }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setCompanies((prev) => prev.filter((c) => c.id !== id));
  } catch (error) {
    console.error("Error removing company:", error);
  }
};

  return (
  <div className="p-4 md:p-6 w-full">
    <h2 className="text-xl font-bold mb-4 md:mb-6">Accepted Companies</h2>  
    {companies.length === 0 ? (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
        <p className="text-gray-500 text-lg">No accepted companies</p>
        <p className="text-gray-400 text-sm mt-2">Accept companies from pending requests</p>
      </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
              <th className="py-3 px-4 text-left font-semibold">Logo</th>
              <th className="py-3 px-4 text-left font-semibold">Name</th>
              <th className="py-3 px-4 text-left font-semibold hidden md:table-cell">Date Added</th>
              <th className="py-3 px-4 text-left font-semibold hidden md:table-cell">Status</th>
              <th className="py-3 px-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <img
                      src={company.logo_path || company.logo_url || "https://via.placeholder.com/48"}
                      alt={company.company_name}
                      className="w-10 h-10 md:w-12 md:h-12 object-contain rounded"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium">{company.company_name}</div>
                    <div className="text-sm text-gray-500 md:hidden">
                      {new Date(company.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    {new Date(company.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      {company.verification_status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition-colors w-full md:w-auto"
                      onClick={() => handleRemoveFromAccepted(company.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Mobile Stats */}
      <div className="md:hidden mt-4 text-sm text-gray-600">
        <p>{companies.length} accepted companies</p>
      </div>
    </div>
  );
}