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
  <div className="p-6 w-full">
    <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
      <thead className="bg-gray-200">
        <tr>
          <th className="py-2 px-3 text-center font-semibold">Logo</th>
          <th className="py-2 px-3 text-center font-semibold">Name</th>
          <th className="py-2 px-3 text-center font-semibold">Status</th>
          <th className="py-2 px-3 text-center font-semibold">Date Added</th>
          <th className="py-2 px-3 text-center font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody>
        {companies.map((company) => (
          <tr
            key={company.id}
            className="border-b hover:bg-gray-50 text-center"
          >
            {/* Logo */}
            <td className="py-2 px-3 flex justify-center">
              <img
                src={company.logo_path || "https://via.placeholder.com/48"}
                alt={company.company_name}
                className="w-12 h-12 object-contain rounded"
              />
            </td>

            {/* Name */}
            <td className="py-2 px-3 font-medium">{company.company_name}</td>

            {/* Status */}
            <td className="py-2 px-3">{company.verification_status}</td>

            {/* Date */}
            <td className="py-2 px-3">
              {company.created_at
                ? new Date(company.created_at).toLocaleDateString()
                : "N/A"}
            </td>

            {/* Actions */}
            <td className="py-2 px-3 flex justify-center gap-2">
              {/* Edit status */}
              <select
                value={company.verification_status}
                onChange={(e) =>
                  handleStatusUpdate(company.id, e.target.value)
                }
                className="border px-2 py-1 rounded"
              >
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>

              {/* Delete */}
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={() => handleDelete(company.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
}