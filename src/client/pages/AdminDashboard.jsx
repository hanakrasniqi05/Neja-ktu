import React, { useState } from "react";
import Sidebar from "./Sidebar";
import PendingRequests from "./PendingRequests";
import AllCompanies from "./AllCompanies";

// Main Admin Dashboard component
export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState("pending"); // Track current page

  // Render content based on current page
  const renderPage = () => {
    switch (currentPage) {
      case "pending":
        return <PendingRequests />;
      case "all":
        return <AllCompanies />;
      case "accepted":
        return <div className="p-6">Accepted Companies Page</div>;
      case "denied":
        return <div className="p-6">Denied Companies Page</div>;
      default:
        return <PendingRequests />;
    }
  };

  return (
    <div className="flex">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 bg-gray-100 min-h-screen">{renderPage()}</div>
    </div>
  );
}
