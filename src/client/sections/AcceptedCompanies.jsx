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

  return (
    <div className="p-6 w-full">
      <h2 className="text-xl font-bold mb-4">Accepted Companies</h2>
      <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-3 text-left font-semibold">Logo</th>
            <th className="py-2 px-3 text-left font-semibold">Name</th>
            <th className="py-2 px-3 text-left font-semibold">Date Added</th>
            <th className="py-2 px-3 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-3">
                <img
                  src={company.logo_url || "https://via.placeholder.com/48"}
                  alt={company.company_name}
                  className="w-12 h-12 object-contain rounded"
                />
              </td>
              <td className="py-2 px-3 font-medium">{company.company_name}</td>
              <td className="py-2 px-3">
                {new Date(company.created_at).toLocaleDateString()}
              </td>
              <td className="py-2 px-3 flex gap-2">
                <button className="bg-teal-blue text-white px-3 py-1 rounded hover:opacity-90">
                  Edit Status
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
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
