import React, { useState } from "react";
import Sidebar from "../sections/Sidebar";
import PendingRequests from "../sections/PendingRequests";
import AllCompanies from "../sections/AllCompanies";
import AcceptedCompanies from "../sections/AcceptedCompanies";
import DeniedCompanies from "../sections/DeniedCompanies";
import AllEvents from "../sections/AllEvents";
import AllUsers from "../sections/AllUsers";
import RSVPs from "../sections/RSVPs";
import AdminStatistics from "../sections/DashboardStats";

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState("pending");

  // Render content based on current page
  const renderPage = () => {
    switch (currentPage) {
      case "pending":
        return <PendingRequests />;
      case "all":
        return <AllCompanies />;
      case "accepted":
        return <AcceptedCompanies />;
      case "denied":
        return <DeniedCompanies />;
      case "all-events":
        return <AllEvents />;
      case "all-users":
        return <AllUsers />;
      case "rsvps":
        return <RSVPs />;
      case "dashboard":
        return <AdminStatistics />;
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
