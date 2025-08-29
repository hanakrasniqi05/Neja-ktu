import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AllCompanies() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/admin/companies", {
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

  return (
    <div className="p-6 w-full">
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th>Logo</th>
            <th>Name</th>
            <th>Status</th>
            <th>Date Added</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id} className="border-b">
              <td>
                <img
                  src={company.logo_url || "https://via.placeholder.com/48"}
                  alt={company.company_name}
                  className="w-12 h-12 rounded"
                />
              </td>
              <td>{company.company_name}</td>
              <td>{company.status}</td>
              <td>{new Date(company.created_at).toLocaleDateString()}</td>
              <td className="py-2 px-3 flex gap-2">
                <button
                  className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700"
                  onClick={() => alert("Feature not implemented yet!")}
                >
                  Edit Status
                </button>
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
