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
    <h2 className="text-xl font-bold mb-4 md:mb-6">All Companies</h2>
      <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left font-semibold min-w-[80px]">Logo</th>
              <th className="py-3 px-4 text-left font-semibold min-w-[120px]">Name</th>
              <th className="py-3 px-4 text-left font-semibold min-w-[100px]">Status</th>
              <th className="py-3 px-4 text-left font-semibold min-w-[100px]">Date Added</th>
              <th className="py-3 px-4 text-left font-semibold min-w-[200px]">Actions</th>
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
                <tr
                  key={company.id}
                  className="border-b hover:bg-gray-50"
                >
                  {/* Logo */}
                  <td className="py-3 px-4">
                    <img
                      src={company.logo_path || "https://via.placeholder.com/48"}
                      alt={company.company_name}
                      className="w-10 h-10 md:w-12 md:h-12 object-contain rounded"
                    />
                  </td>

                  {/* Name */}
                  <td className="py-3 px-4 font-medium">
                    <div className="font-medium">{company.company_name}</div>
                    <div className="text-sm text-gray-500 md:hidden">
                      {company.verification_status}
                    </div>
                  </td>

                  {/* Status - Hidden on mobile, shown in name column */}
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      company.verification_status === 'verified' ? 'bg-green-100 text-green-800' :
                      company.verification_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {company.verification_status}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      {company.created_at
                        ? new Date(company.created_at).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col md:flex-row gap-2">
                      {/* Status dropdown */}
                      <select
                        value={company.verification_status}
                        onChange={(e) =>
                          handleStatusUpdate(company.id, e.target.value)
                        }
                        className="border px-3 py-2 rounded text-sm w-full md:w-auto"
                      >
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="rejected">Rejected</option>
                      </select>

                      {/* Delete button */}
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition-colors w-full md:w-auto"
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
      
      {/* Mobile Stats */}
      <div className="md:hidden mt-4 text-sm text-gray-600">
        <p>Showing {companies.length} companies</p>
      </div>
    </div>
  );
}