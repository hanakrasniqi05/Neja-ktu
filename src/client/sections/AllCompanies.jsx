import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AllCompanies() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/admin/companies/all", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCompanies(res.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;
    
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/companies/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompanies((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/admin/companies/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, verification_status: status } : c
        )
      );
    } catch (error) {
      console.error("Error updating company status:", error);
    }
  };

  return (
  <div className="p-4 md:p-6 w-full">
    <div className="flex justify-between items-center mb-4 md:mb-6">
      <h2 className="text-xl font-bold">All Companies</h2>
      <div className="text-sm text-gray-500 md:hidden">
        Showing {companies.length} companies
      </div>
    </div>
      
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-300 bg-white">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left font-semibold">Logo</th>
              <th className="py-3 px-4 text-left font-semibold">Name</th>
              <th className="py-3 px-4 text-left font-semibold">Status</th>
              <th className="py-3 px-4 text-left font-semibold">Date Added</th>
              <th className="py-3 px-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">
                  No companies found
                </td>
              </tr>
            ) : (
              companies.map((company) => (
                <tr key={company.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <img
                      src={company.logo_path || "https://via.placeholder.com/48"}
                      alt={company.company_name}
                      className="w-10 h-10 object-contain rounded"
                    />
                  </td>
                  <td className="py-3 px-4 font-medium">
                    {company.company_name}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      company.verification_status === 'verified' ? 'bg-green-100 text-green-800' :
                      company.verification_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {company.verification_status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {company.created_at
                      ? new Date(company.created_at).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <select
                        value={company.verification_status}
                        onChange={(e) => handleStatusUpdate(company.id, e.target.value)}
                        className="border px-3 py-1.5 rounded text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm transition-colors"
                        onClick={() => handleDelete(company.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="md:hidden space-y-4">
        {companies.length === 0 ? (
          <div className="py-8 text-center text-gray-500 border rounded-lg bg-white">
            No companies found
          </div>
        ) : (
          companies.map((company) => (
            <div key={company.id} className="bg-white border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={company.logo_path || "https://via.placeholder.com/48"}
                    alt={company.company_name}
                    className="w-12 h-12 object-contain rounded"
                  />
                  <div>
                    <h3 className="font-medium">{company.company_name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        company.verification_status === 'verified' ? 'bg-green-100 text-green-800' :
                        company.verification_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {company.verification_status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {company.created_at
                          ? new Date(company.created_at).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <select
                      value={company.verification_status}
                      onChange={(e) => handleStatusUpdate(company.id, e.target.value)}
                      className="border px-3 py-1.5 rounded text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="verified">Verified</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <button
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition-colors"
                    onClick={() => handleDelete(company.id)}
                  >
                    Delete Company
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}