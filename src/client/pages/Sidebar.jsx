import React from "react";

// Sidebar for navigation
export default function Sidebar({ currentPage, setCurrentPage }) {
  return (
    <div className="w-1/3 bg-teal-600 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
      <ul className="space-y-3">
        <li
          onClick={() => setCurrentPage("pending")}
          className={`cursor-pointer p-2 rounded ${
            currentPage === "pending" ? "bg-teal-800" : ""
          }`}
        >
          Pending Requests
        </li>
        <li
          onClick={() => setCurrentPage("all")}
          className={`cursor-pointer p-2 rounded ${
            currentPage === "all" ? "bg-teal-800" : ""
          }`}
        >
          All Companies
        </li>
        <li
          onClick={() => setCurrentPage("accepted")}
          className={`cursor-pointer p-2 rounded ${
            currentPage === "accepted" ? "bg-teal-800" : ""
          }`}
        >
          Accepted Companies
        </li>
        <li
          onClick={() => setCurrentPage("denied")}
          className={`cursor-pointer p-2 rounded ${
            currentPage === "denied" ? "bg-teal-800" : ""
          }`}
        >
          Denied Companies
        </li>
      </ul>
    </div>
  );
}
