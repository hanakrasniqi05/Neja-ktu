import React, { useState } from "react";
import Sidebar from "../sections/Sidebar";
import PendingRequests from "../sections/PendingRequests";
import AllCompanies from "../sections/AllCompanies";
import AcceptedCompanies from "../sections/AcceptedCompanies";
import DeniedCompanies from "../sections/DeniedCompanies";
import AllEvents from "../sections/AllEvents";
import AllUsers from "../sections/AllUsers";
import RSVPs from "../sections/RSVPs";

// placeholder per ststistika
function DashboardStats() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">📊 Dashboard Stats</h2>
      <p>Statistika per faqe, usera, rsvp etj...</p>
    </div>
  );
}

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
        return <DashboardStats />;
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
