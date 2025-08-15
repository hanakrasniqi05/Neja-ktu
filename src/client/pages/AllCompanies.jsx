import React, { useState, useEffect } from "react";

// Component to display all companies in a table
export default function AllCompanies() {
  const [companies, setCompanies] = useState([]);

  // Load placeholder data
  useEffect(() => {
    setCompanies([
      {
        id: 1,
        logo_url: "https://via.placeholder.com/48",
        name: "Tech Solutions",
        status: "pending",
        created_at: "2025-08-15",
      },
      {
        id: 2,
        logo_url: "https://via.placeholder.com/48",
        name: "Green Energy",
        status: "accepted",
        created_at: "2025-08-14",
      },
    ]);
  }, []);

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
                <img src={company.logo_url} alt={company.name} className="w-12 h-12" />
              </td>
              <td>{company.name}</td>
              <td>{company.status}</td>
              <td>{company.created_at}</td>
              <td>
                <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Edit Status</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
